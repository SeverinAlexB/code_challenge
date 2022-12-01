import { PingPongMessage } from "../messages/PingPongMessage";

const Link = require('grenache-nodejs-link'); // No types available? :(
const { PeerRPCClient } = require('grenache-nodejs-http'); // No types available? :(

export class ExchangeClient {
    private link: typeof Link;
    private peer: typeof PeerRPCClient;
    private clientId = Math.floor(Math.random() * 9999);

    public init() {
        this.link = new Link({
            grape: 'http://127.0.0.1:30001'
            });
            this.link.start();
        
            this.peer = new PeerRPCClient(this.link, {});
            this.peer.init();
            console.log(`Client started. ID:`, this.clientId)
    }

    public ping() {
            const message = new PingPongMessage();
            message.creatorId = this.clientId;
            message.creatorType = 'client';
            message.message = 'ping';
        
            const jsonMessage = JSON.stringify(message);
        
            this.peer.request('exchange', jsonMessage, { timeout: 10000 }, (err: any, data: any) => {
                if (err) {
                    console.error('Error:', err);
                    throw new Error(err);
                }
                console.log('Ping successful:', data);
            });
    }
    
}