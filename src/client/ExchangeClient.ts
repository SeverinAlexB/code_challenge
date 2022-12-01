import { AddOrderMessage } from "../messages/AddOrderMessage";
import { GetOrderMatchesMessage } from "../messages/GetOrderMatchesMessage";
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

    private async request(requestData: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.peer.request('exchange', requestData, { timeout: 10000 }, (err: any, data: any) => {
                if (err) {
                    console.error('Error:', err);
                    reject(err);
                }
                const deserialized = JSON.parse(data);
                resolve(deserialized);
            });
        })
    }

    public async ping() {
            const message = new PingPongMessage();
            message.creatorId = this.clientId;
            message.creatorType = 'client';
            message.message = 'ping';
        
            const jsonMessage = JSON.stringify(message);

            const result = await this.request(jsonMessage);
            console.log('Ping successful:', result);
    }

    public async addOrder(order: AddOrderMessage) {
        order.creatorId = this.clientId;
        order.creatorType = 'client';
        const jsonMessage = JSON.stringify(order);

        const result = await this.request(jsonMessage);
        console.log(`Added order ${order.toString()} successfully`, result);

    }

    public async getOrderMatches(orderId: string): Promise<AddOrderMessage[]> {
        const message = new GetOrderMatchesMessage();
        message.orderId = orderId;
        message.creatorId = this.clientId;
        message.creatorType = 'client';
        const jsonMessage = JSON.stringify(message);

        const result = await this.request(jsonMessage);

        const orders = result.map((order: any) => AddOrderMessage.fromJson(order));
        console.log(`Found the following matches`, orders);
        return orders;
    }
    
}