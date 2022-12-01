
import { ExchangeServer } from "./ExchangeServer";

export async function startServer(exchangeId: number) {
    const server = new ExchangeServer(exchangeId);
    server.init();
    await server.syncOrderBook();
}