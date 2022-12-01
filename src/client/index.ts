import { sleep } from "../helper";
import { AddOrderMessage } from "../messages/AddOrderMessage";
import { ExchangeClient } from "./ExchangeClient";



export async function startClient(exchangeId: number) {
    const client = new ExchangeClient(exchangeId);
    client.init();
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

    process.exit(0);
}