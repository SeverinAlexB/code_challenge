const { PeerRPCServer } = require('grenache-nodejs-http'); // No types available? :(
const Link = require('grenache-nodejs-link');

function exampleServer() {
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

    setInterval(() => {
        link.announce('rpc_test', service.port, {})
    }, 1000);

    service.on('request', (rid: any, key: any, payload: any, handler: any) => {
        console.log(payload) //  { msg: 'hello' }
        handler.reply(null, { msg: 'world' })
    })
}

export function startServer() {
    console.log('Start server.');
    exampleServer();
}