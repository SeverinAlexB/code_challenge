import { startServer } from "./server";
import { startClient } from "./client";

enum CommandEnum {
  server=1,
  client=2
}

function getCommand(): CommandEnum {
  const invalidArgError = new Error("Command line argument required. Either use 'server' or 'client'. Example: `npm run start -- server`.");
  if (process.argv.length < 3) {
    throw invalidArgError;
  }
  const arg = process.argv[2];  
  if (arg === 'server') {
    return CommandEnum.server;
  } else if (arg === 'client') {
    return CommandEnum.client;
  } else {
    throw invalidArgError;
  }
}

const command = getCommand();
if (command === CommandEnum.client) {
  startClient();
} else if (command === CommandEnum.server) {
  startServer();
}
