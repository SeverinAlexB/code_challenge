import { ExchangeClient } from "../client/ExchangeClient";
import { AddOrderMessage } from "../messages/AddOrderMessage";
import { ExecuteOrderResponse } from "../messages/ExecuteOrderResponse";
import { PingPongMessage } from "../messages/PingPongMessage";
import { OrderBook } from "./OrderBook";

const { PeerRPCServer } = require('grenache-nodejs-http'); // No types available? :(
const Link = require('grenache-nodejs-link');

export class ExchangeServer {
    public book = new OrderBook();
    private link: typeof Link;
    private server: typeof PeerRPCServer;
    private announceIntervalId: NodeJS.Timeout | undefined;
    constructor(public exchangeId: number) {}

    public init() {
        this.link = new Link({
            grape: 'http://127.0.0.1:30001'
        });
        this.link.start();
    
        this.server = new PeerRPCServer(this.link, {
            timeout: 300000
        });
        this.server.init();
    
        const port = this.exchangeId;
        const service = this.server.transport('server');
        service.listen(port);

        this.announceIntervalId = setInterval(() => {
            this.link.announce('exchange', service.port, {})
        }, 1000);

        service.on('request', (rid: any, key: any, payload: any, handler: any) => {
            const msg = JSON.parse(payload);
            console.log(`Received from ${msg.exchangeId}:`, payload);
            const response = this.onMessageReceived(msg);
            if (response) {
                const serialized = JSON.stringify(response);
                console.log(`- Reply with:`, serialized);
                handler.reply(null, serialized);
            }
        });

        console.log(`Server started. ID:`, this.exchangeId);
    }

    public stop() {
        console.log('Stop server', this.exchangeId);
        if (this.announceIntervalId) {
            clearInterval(this.announceIntervalId);
        }
        if (this.link) {
            this.link.stop();
        }
    }

    private onMessageReceived(msg: any): any {
        if (msg.type === 'PingPongMessage') {
            return this.processPingPong(msg);
        } else if (msg.type === 'AddOrderMessage') {
            return this.processAddOrder(msg);
        } else if (msg.type === 'GetOrderMatchesMessage') {
            return this.processGetOrderMatches(msg);
        } else if (msg.type === 'ExecuteOrderMessage') {
            return this.processExecuteOrder(msg);
        } else if (msg.type === 'GetOrderbookMessage') {
            return this.processGetOrderbook(msg);
        } else {
            throw new Error('Unknown message type ' + msg);
        }   
    }

    private processPingPong(msg: any): any {
            const message = new PingPongMessage();
            message.exchangeId = this.exchangeId;
            message.creatorType = 'server';
            message.message = 'pong';
            return message
    }

    private processAddOrder(msg: any): any {
        const order = AddOrderMessage.fromJson(msg);
        this.book.add(order);
        // Todo: Call other peers to tell them that we have a new order.
        return 'ok';
    }

    private processGetOrderMatches(msg: any): any {
        const orderId = msg.orderId;
        const matches = this.book.getMatches(orderId);
        return matches;
    }

    private processExecuteOrder(msg: any): any {
        // The trade will be executed on Lightning (Taro or TBD?).
        // Trade can be executed within 15min. During this time, the order is exclusively locked for this specific user.

        const orderId = msg.orderId;
        // Todo: Check if order actually exists and the user really want to do this.
        // Make a redis lock on the orderId which expires in 15min.

        const response = new ExecuteOrderResponse();
        response.exchangeId = this.exchangeId;
        response.creatorType = 'server';
        const _15min = 1000*60*15;
        response.exiresAt = new Date().getTime() + _15min;
        response.orderId = orderId;

        // Make lightning invoice expire in 15min.
        response.lightningInvoice = 'lntb1u1pwz5w78pp5e8w8cr5c30xzws92v36sk45znhjn098rtc4pea6ertnmvu25ng3sdpywd6hyetyvf5hgueqv3jk6meqd9h8vmmfvdjsxqrrssy29mzkzjfq27u67evzu893heqex737dhcapvcuantkztg6pnk77nrm72y7z0rs47wzc09vcnugk2ve6sr2ewvcrtqnh3yttv847qqvqpvv398';
        return response;
    }

    private processGetOrderbook(msg: any): any {
        return this.book.orders;
    }

    public async getPeerServiceEndpoints(): Promise<string[]> {
        const endpoints = await new Promise<string[]>((resolve, reject) => {
            this.link.lookup('exchange', [], (err: any, data: string[]) => {
                if (err) {
                    if (err.message === 'ERR_GRAPE_LOOKUP_EMPTY') {
                        resolve([]);
                    } else {
                        reject(err);
                    }
                    return;
                }
                resolve(data);
            })
        });
       return endpoints.filter(endpoint => !endpoint.includes(':' + this.exchangeId)); // Remove myself.
    }

    public async syncOrderBook() {
        const endpoints = await this.getPeerServiceEndpoints();
        if (endpoints?.length === 0) {
            return;
        }

        const client = new ExchangeClient(this.exchangeId);
        client.init();
        for (const endpoint of endpoints) {
            const orders = await client.getOrderbook(endpoint)
            console.log(`Synced ${orders.length} orders from ${endpoint}`);
            for (const orderJson of orders) {
                const order = AddOrderMessage.fromJson(orderJson);
                this.book.add(order);
                console.log(' -', order.toString());
            }
        }
    }

}