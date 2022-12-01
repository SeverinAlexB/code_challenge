

import { ExchangeClient } from "./client/ExchangeClient";
import { sleep } from "./helper";
import { AddOrderMessage } from "./messages/AddOrderMessage";
import { ExchangeServer } from "./server/ExchangeServer";

async function main() {
  const exchangeId = 1024 + Math.floor(Math.random() * 1000);

  const server = new ExchangeServer(exchangeId);
  try {
    server.init();
    await sleep(2000);
    const client = new ExchangeClient(exchangeId);
    client.init();

    await startPlaybook(client);

  } finally {
    server.stop();
  }
  
}

async function startPlaybook(client: ExchangeClient) {
  await client.ping();

  const buyOrder = new AddOrderMessage();
  buyOrder.amountToBuy = 1;
  buyOrder.buy = 'BTC';
  buyOrder.sell = 'USD';

  await client.addOrder(buyOrder);

  setTimeout(() => {
      // Add sell order with a delay
      const sellOrder = new AddOrderMessage();
      sellOrder.amountToBuy = 1;
      sellOrder.buy = 'USD';
      sellOrder.sell = 'BTC';
      client.addOrder(sellOrder);
  }, 1500);

  let matches: AddOrderMessage[] = [];
  while (true) {
      await sleep(1000);
      matches = await client.getOrderMatches(buyOrder.id);
      if (matches.length > 0) {
          break;
      }
  }
  console.log(`Found ${matches.length} matches to our initial order.`);
  for (const match of matches) {
      console.log(`-`, match.toString());
  }

  const invoice = await client.executeOrder(matches[0].id);

  console.log(`Execute trade with Lightninig invoice that expires in 15min.`, invoice.orderId, '<-->', buyOrder.id);
  // Todo: Pay lightning invoice to complete the exchange.
  
  console.log('Notify peers to remove the orders from the orderbook.');
  // Todo: Notify peers to remove the orders from the orderbook.

  process.exit(0);
}

main();
