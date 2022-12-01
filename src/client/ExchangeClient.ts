import { AddOrderMessage } from "../messages/AddOrderMessage";
import { ExecuteOrderMessage } from "../messages/ExecuteOrderMessage";
import { ExecuteOrderResponse } from "../messages/ExecuteOrderResponse";
import { GetOrderMatchesMessage } from "../messages/GetOrderMatchesMessage";
import { PingPongMessage } from "../messages/PingPongMessage";

const Link = require('grenache-nodejs-link'); // No types available? :(
const { PeerRPCClient } = require('grenache-nodejs-http'); // No types available? :(

export class ExchangeClient {
    private link: typeof Link;
    private peer: typeof PeerRPCClient;
    constructor(public exchangeId: number) {}

    public init() {
        this.link = new Link({
            grape: 'http://127.0.0.1:30001'
        });
        this.link.start();
    
        this.peer = new PeerRPCClient(this.link, {});
        this.peer.init();
        console.log(`Client started. ID:`, this.exchangeId);
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
            message.creatorId = this.exchangeId;
            message.creatorType = 'client';
            message.message = 'ping';
        
            const jsonMessage = JSON.stringify(message);

            const result = await this.request(jsonMessage);
            console.log('Ping successful:', result);
    }

    public async addOrder(order: AddOrderMessage) {
        order.creatorId = this.exchangeId;
        order.creatorType = 'client';
        const jsonMessage = JSON.stringify(order);

        const result = await this.request(jsonMessage);
        console.log(`Added order ${order.toString()} successfully`, result);

    }

    public async getOrderMatches(orderId: string): Promise<AddOrderMessage[]> {
        const message = new GetOrderMatchesMessage();
        message.orderId = orderId;
        message.creatorId = this.exchangeId;
        message.creatorType = 'client';
        const jsonMessage = JSON.stringify(message);

        const result = await this.request(jsonMessage);

        const orders = result.map((order: any) => AddOrderMessage.fromJson(order));
        console.log(`Found the following matches`, orders);
        return orders;
    }

    public async getServiceEndpoints(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.link.lookup('exchange', [], (res: any, endpoints: string[]) => {
                resolve(endpoints);
            })
        });
    }

    public async syncOrderBook() {
        const endpoints = await this.getServiceEndpoints();
        // Todo: Call each endpoint to get their orderbooks. Merge then into our book.
    }

    public async executeOrder(orderId: string): Promise<ExecuteOrderResponse> {
        const message = new ExecuteOrderMessage();
        message.creatorId = this.exchangeId;
        message.creatorType = 'client';
        message.orderId = orderId;
        return await this.request(message);
    }
    
}