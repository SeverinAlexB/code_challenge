import { startServer } from "./server";
import { startClient } from "./client";
import { sleep } from "./helper";


async function main() {
  const exchangeId = 1024 + Math.floor(Math.random() * 1000);
  await startServer(exchangeId);
  await sleep(1000);
  await startClient(exchangeId);
}

main();
