const Link = require('grenache-nodejs-link'); // No types available? :(
const { PeerRPCClient } = require('grenache-nodejs-http'); // No types available? :(

function exampleClient(clientId: number){


    const link = new Link({
    grape: 'http://127.0.0.1:30001'
    });
    link.start();

    const peer = new PeerRPCClient(link, {});
    peer.init();

    const msg = JSON.stringify({
        msg: 'hello',
        clientId: clientId
    });
    for (let i = 0; i< 10; i++) {
        peer.request('rpc_test', msg, { timeout: 10000 }, (err: any, data: any) => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log(i, data); // world
        });
    }
}

export function startClient() {
    const clientId = Math.floor(Math.random() * 9999);
    console.log('Start client', clientId);
    exampleClient(clientId);
}