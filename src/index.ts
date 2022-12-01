

import { ExchangeClient } from "./client/ExchangeClient";
import { sleep } from "./helper";
import { AddOrderMessage } from "./messages/AddOrderMessage";
import { ExchangeServer } from "./server/ExchangeServer";

async function main() {
  const exchangeId = 1024 + Math.floor(Math.random() * 1000);
  console.log(`ExchangeId: ${exchangeId}`);

  const server = new ExchangeServer(exchangeId);
  try {
    server.init();
    await sleep(2000);
    await server.syncOrderBook();
    console.log(`Server started.`);

    const client = new ExchangeClient(exchangeId);
    client.init();
    console.log(`Client started.`);
    console.log();

    await startPlaybook(client);

  } finally {
    server.stop();
  }

}

async function startPlaybook(client: ExchangeClient) {
  console.log('Ping pong')
  await client.ping();
  console.log()

  console.log('Publish buy order.')
  const buyOrder = new AddOrderMessage({buy: 'BTC', sell: 'USD', amountToBuy: 1});
  await client.addOrder(buyOrder);
  console.log();

  setTimeout(() => {
    // Add sell order with a delay to simulate an async match.
    const sellOrder = new AddOrderMessage({buy: 'USD', sell: 'BTC', amountToBuy: 1});
    client.addOrder(sellOrder);
  }, 3000);

  console.log('Poll order matches.');
  let matches: AddOrderMessage[] = [];
  while (true) {
    // Check buy order every second to see if we have a match.
    await sleep(1000);
    matches = await client.getOrderMatches(buyOrder.id);
    if (matches.length > 0) {
      console.log('- No matches found.');
      break;
    }
  }
  console.log(`Found ${matches.length} matches to our buy order.`);
  for (const match of matches) {
    console.log(`-`, match.toString());
  }
  console.log();

  console.log('Execute order');
  const invoice = await client.executeOrder(matches[0]);

  console.log(`Execute trade with Lightninig invoice that expires in 15min.`, invoice.orderId, '<-->', buyOrder.id);
  // Todo: Pay lightning invoice to complete the exchange.

  console.log('Notify peers to remove the orders from the orderbook.');
  // Todo: Notify peers to remove the orders from the orderbook.

  process.exit(0);
}

main();
