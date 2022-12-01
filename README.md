# Code Challenge

This is a first try of a P2P exchange that uses grape for service discovery.

## What is implemented

Every user runs a ExchangeClient (RPCClient) and an ExchangeServer (RPCServer). They communicate via messages in [src/message](src/message/).

The client can call the server and execute the following commands:
- Ping Pong
- Add order ($1/1BTC)
- Ask for matches to its order. Matches are polled every 1.5s.
- Ask the specific service endpoint of the matching order to get us a lightning invoice.
- Get all orders from orderbook.

The server has the following capabilities:
- Ping Pong
- Looks up a list of all available service endpoints. These can be used to sync the orderbook initially.
- Receives single orders and adds it to its orderbook.
- Returns matches to the user from within it's orderbook.
- Returns a lightning invoice (expires within 15min) in case somebody wants to execute the trade (expiring redis lock on orderId for 15min).
- Returns complete orderbook for sync purposes.

## What can be improved

I made a lot of `// Todo:` in the code where improvements are necessary. Some highlights:

- Messages are serialized/desearlized manually. A library like [ts-serialize](https://www.npmjs.com/package/ts-serializable) could help enourmously.
- Orders are currently not removed after execution and they don't expire.
- New orders are not propagated to the peers.
- The code has room for improvement from an "Clean Code" perspective. Same with tests.
- `exchangeId` is the same as the server port. This simplifies the development but is of course not a solution in the real world.
- Add better logging system.
- One could make the system more resilient as a failed request brings the whole system down instead of trying trying another peer.
- The current system only matches orders that are a 100% fit.


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
- publishes a sell order 7s after the buy order.
- Fetches the lightning invoice.


## Dev

Run unit tests:

```bash
npm run test
```