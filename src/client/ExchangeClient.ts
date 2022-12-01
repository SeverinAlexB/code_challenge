import { AddOrderMessage } from "../messages/AddOrderMessage";
import { ExecuteOrderMessage } from "../messages/ExecuteOrderMessage";
import { ExecuteOrderResponse } from "../messages/ExecuteOrderResponse";
import { GetOrderbookMessage } from "../messages/GetOrderbookMessage";
import { GetOrderMatchesMessage } from "../messages/GetOrderMatchesMessage";
import { PingPongMessage } from "../messages/PingPongMessage";
import { SingleEndpointGrapeLink } from "./StaticGrapeLink";

const Link = require('grenache-nodejs-link'); // No types available? :(
const { PeerRPCClient } = require('grenache-nodejs-http'); // No types available? :(

export class ExchangeClient {
    private link: typeof Link;
    private peer: typeof PeerRPCClient;
    constructor(public exchangeId: number) { }

    public init() {
        this.link = new Link({
            grape: 'http://127.0.0.1:30001'
        });
        this.link.start();

        this.peer = new PeerRPCClient(this.link, {});
        this.peer.init();
    }

    private async request(requestData: any): Promise<any> {
        const jsonMessage = JSON.stringify(requestData);
        return new Promise<any>((resolve, reject) => {
            try {
                this.peer.request('exchange', jsonMessage, { timeout: 10000 }, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const deserialized = JSON.parse(data);
                    resolve(deserialized);
                });
            } catch (e) {
                reject(e);
            }

        })
    }

    private async requestEndpoint(requestData: any, endPoint: string): Promise<any> {
        const peer = new PeerRPCClient(new SingleEndpointGrapeLink(endPoint));
        peer.init();
        const jsonMessage = JSON.stringify(requestData);
        return new Promise<any>((resolve, reject) => {
            try {
                this.peer.request('exchange', jsonMessage, { timeout: 10000 }, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const deserialized = JSON.parse(data);
                    resolve(deserialized);
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    public async ping() {
        const message = new PingPongMessage('ping');
        message.exchangeId = this.exchangeId;
        message.creatorType = 'client';

        try {
            await this.request(message);
            console.log('Ping successful.');
        } catch (e) {
            console.log('Ping failed.');
        }

    }

    public async addOrder(order: AddOrderMessage) {
        order.exchangeId = this.exchangeId;
        order.creatorType = 'client';

        const result = await this.request(order);
        console.log(`Added order ${order.toString()} successfully`, result);

    }

    public async getOrderMatches(orderId: string): Promise<AddOrderMessage[]> {
        const message = new GetOrderMatchesMessage();
        message.orderId = orderId;
        message.exchangeId = this.exchangeId;
        message.creatorType = 'client';

        const result = await this.request(message);

        const orders = result.map((order: any) => AddOrderMessage.fromJson(order));
        return orders;
    }

    public async executeOrder(order: AddOrderMessage): Promise<ExecuteOrderResponse> {
        const message = new ExecuteOrderMessage();
        message.exchangeId = this.exchangeId;
        message.creatorType = 'client';
        message.orderId = order.id;

        const endpoint = `localhost:${order.exchangeId}`;
        return await this.requestEndpoint(message, endpoint);
    }

    public async getOrderbook(endpoint: string): Promise<AddOrderMessage[]> {
        const message = new GetOrderbookMessage();
        message.exchangeId = this.exchangeId;
        message.creatorType = 'client';

        return await this.requestEndpoint(message, endpoint);
    }

}