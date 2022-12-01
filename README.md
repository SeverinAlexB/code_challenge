# Code Challenge

This is a first try of a P2P exchange that uses grape for service discovery.

## What is implemented

Every user runs a RPC Client and Server. They communicate via messages in [src/message](src/message/).

The client can call the server and execute the following commands:
- Ping Pong
- Add order ($1/1BTC)
- Ask for matches to its order. Matches are polled every 1.5s.
- Ask the specific service endpoint of the matching order to get us a lightning invoice.

The server has the following capabilities:
- Ping Pong
- Looks up a list of all available service endpoints. These can be used to sync the orderbook initially.
- Receives single order and adds it to its orderbook.
- Returns matches to the user from within it's orderbook.
- Returns a lightning invoice (expires within 15min) in case somebody wants to execute the trade. (expiring redis lock on orderId for 15min).

## What can be improved

I made a lot of `// Todo:` in the code where improvements are necessary. Some highlights:

- Messages are serialized/desearlized manually. A library like [ts-serialize](https://www.npmjs.com/package/ts-serializable) could help enourmously.
- Order are currently not removed after execution and they don't expire.
- The orderbook doesn't check for any duplicates.
- Initial orderbooks are not yet synced. The list of endpoints is already fetched though.
- Order are not propagated to the peers.



## Getting started

Install dependencies:
```bash
npm i
```

Run exchange:
```bash
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
npm run start
```

When started, the client automatically runs a [playbook](src/index.ts) where it 
- pings the server.
- publishes a buy order.
- polls for matches every 1s.
- publishes a sell order 1.5s after the buy order.
- Fetches the lightning invoice.


## Dev

Run unit tests:

```bash
npm run test
```