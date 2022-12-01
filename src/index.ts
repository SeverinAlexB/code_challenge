
import { Server } from "http";
import { startClient } from "./client";
import { sleep } from "./helper";
import { ExchangeServer } from "./server/ExchangeServer";


async function main() {
  const exchangeId = 1024 + Math.floor(Math.random() * 1000);

  const server = new ExchangeServer(exchangeId);
  try {
    server.init();
    await sleep(2000);
    await startClient(exchangeId);
  } finally {
    server.stop();
  }
  
}

main();
