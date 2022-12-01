import { BaseMessage } from "./BaseMessage";
import { v4 as uuidv4 } from 'uuid';

// It is assume the market price of 1BTC is 1USD
// Todo: Add market price

export class AddOrderMessage extends BaseMessage {
    public id: string = uuidv4();
    public buy: 'USD' | 'BTC' = 'BTC';
    public sell: 'USD' | 'BTC' = 'USD';
    public amountToBuy: number = 0;

    constructor(opts?: {buy: 'USD' | 'BTC', sell: 'USD' | 'BTC', amountToBuy: number}) {
        super('AddOrderMessage');
        if (opts) {
            this.buy = opts.buy;
            this.sell = opts.sell;
            this.amountToBuy = opts.amountToBuy;
        }
    }

    public isMatch(other: AddOrderMessage): boolean {
        if (this.amountToBuy !== other.amountToBuy) {
            // Only do exact matches to start out.
            // Todo: Add variable matches.
            return false;
        }
        const marketMatch = this.buy === other.sell && this.sell === other.buy;
        return marketMatch;
    }

    public toString(): string {
        return `${this.id} - Buy ${this.amountToBuy} ${this.buy} for ${this.sell}`;
    }

    static fromJson(msg: any): AddOrderMessage {
        const order = new AddOrderMessage();
        Object.assign(order, msg);
        return order;
    }
}
