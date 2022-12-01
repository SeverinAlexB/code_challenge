# Backend Node.js Challenge

Your task is to create a P2P USD/BTC Exchange / OTC network.

* Each server would own a copy of the orderbook.
* Each server can make a call to another server with an order ($50,000/1BTC)
* Orderbooks are synced with other workers if an order is matched.
* You don't need to use a database.
* You don't need to build a UI
* You don't actually need to integrate any payment/blockchain integration.
* Be wary of race conditions

We know its not possible to complete the test in 8 hours. Do as much as you can and in a seperate README file, outline what you missed, improvments...etc


### Tips
You can use Grenache libaries to help you create this application but it's up to you how you approach it.

```
npm i -g grenache-grape
```

```
# boot two grape servers

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Setting up Grenache in your project

```
npm install --save grenache-nodejs-http
npm install --save grenache-nodejs-link
```


### Example RPC server / client with "Hello World"

```js
// This RPC server will announce itself as `rpc_test`
// in our Grape Bittorrent network
// When it receives requests, it will answer with 'world'

'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')


const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const port = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')
service.listen(port)

setInterval(function () {
  link.announce('rpc_test', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log(payload) //  { msg: 'hello' }
  handler.reply(null, { msg: 'world' })
})

```

```js
// This client will as the DHT for a service called `rpc_test`
// and then establishes a P2P connection it.
// It will then send { msg: 'hello' } to the RPC server

'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

peer.request('rpc_test', { msg: 'hello' }, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(data) // { msg: 'world' }
})
```

### More Help

 - http://blog.bitfinex.com/tutorial/bitfinex-loves-microservices-grenache/
 - https://github.com/bitfinexcom/grenache-nodejs-example-fib-client
 - https://github.com/bitfinexcom/grenache-nodejs-example-fib-server