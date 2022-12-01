import { PingPongMessage } from "../messages/PingPongMessage";

const { PeerRPCServer } = require('grenache-nodejs-http'); // No types available? :(
const Link = require('grenache-nodejs-link');

export class ExchangeServer {
    private link: typeof Link;
    private server: typeof PeerRPCServer;
    private serverId =  1024 + Math.floor(Math.random() * 1000);

    public init() {
        this.link = new Link({
            grape: 'http://127.0.0.1:30001'
        });
        this.link.start();
    
        this.server = new PeerRPCServer(this.link, {
            timeout: 300000
        });
        this.server.init();
    
        const port = this.serverId;
        const service = this.server.transport('server');
        service.listen(port);

        setInterval(() => {
            this.link.announce('exchange', service.port, {})
        }, 1000);

        service.on('request', (rid: any, key: any, payload: any, handler: any) => {
            const msg = JSON.parse(payload);
            console.log(`Received from ${msg.creatorId}:`, payload);
            const response = this.onMessageReceived(msg);
            if (response) {
                const serialized = JSON.stringify(response);
                console.log(`- Reply with:`, serialized);
                handler.reply(null, serialized);
            }
        });

        console.log(`Server started. ID:`, this.serverId);
    }

    private onMessageReceived(msg: any): any {
        if (msg.type === 'PingPongMessage') {
            return this.processPingPong(msg);
        } else {
            throw new Error('Unknown message type ' + msg);
        }
    }

    private processPingPong(msg: any): any {
            const message = new PingPongMessage();
            message.creatorId = this.serverId;
            message.creatorType = 'server';
            message.message = 'pong';
            return message
    }
}