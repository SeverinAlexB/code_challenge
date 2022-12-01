
import { ExchangeServer } from "./ExchangeServer";

export async function startServer() {
    const server = new ExchangeServer();
    server.init();
}