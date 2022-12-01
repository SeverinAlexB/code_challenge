import { ExchangeClient } from "./ExchangeClient";


export function startClient() {
    const client = new ExchangeClient();
    client.init();
    client.ping();
    setTimeout(() => {
        client.ping();
    }, 3000);
}