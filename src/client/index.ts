const Link = require('grenache-nodejs-link'); // No types available? :(
    const { PeerRPCClient } = require('grenache-nodejs-http'); // No types available? :(

function exampleClient(){
    const link = new Link({
    grape: 'http://127.0.0.1:30001'
    })
    link.start()

    const peer = new PeerRPCClient(link, {})
    peer.init()

    peer.request('rpc_test', 'hello', { timeout: 10000 }, (err: any, data: any) => {
    if (err) {
        console.error(err)
        process.exit(-1)
    }
    console.log(data) // world
    })
}

export function startClient() {
    console.log('Start client.');
    exampleClient();
}