
import { ExchangeServer } from "./ExchangeServer";

export function startServer() {
    const server = new ExchangeServer();
    server.init();
}