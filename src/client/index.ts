import { AddOrderMessage } from "../messages/AddOrderMessage";
import { ExchangeClient } from "./ExchangeClient";


export function startClient() {
    const client = new ExchangeClient();
    client.init();
    // client.ping();
    
    const buyOrder = new AddOrderMessage();
    buyOrder.amountToBuy = 1;
    buyOrder.buy = 'BTC';
    buyOrder.sell = 'USD';

    client.addOrder(buyOrder);

    const intervalId = setInterval(() => {
        client.getOrderMatches(buyOrder.id);
    }, 1000);

    setTimeout(() => {
        const sellOrder = new AddOrderMessage();
        sellOrder.amountToBuy = 1;
        sellOrder.buy = 'USD';
        sellOrder.sell = 'BTC';
    
        client.addOrder(sellOrder);
    }, 1500);
}