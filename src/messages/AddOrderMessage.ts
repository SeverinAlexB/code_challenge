import { BaseMessage } from "./BaseMessage";
import { v4 as uuidv4 } from 'uuid';


export class AddOrderMessage extends BaseMessage {
    public id: string = uuidv4();
    public buy: 'USD' | 'BTC' = 'BTC';
    public sell: 'USD' | 'BTC' = 'USD';
    public amountToBuy: number = 0;

    constructor() {
        super('AddOrderMessage');
    }

    public isMatch(other: AddOrderMessage): boolean {
        if (this.id === other.id) {
            return false;
        }
        if (this.amountToBuy !== other.amountToBuy) {
            // Only do exact matches to start out.
            // Todo: Add variable matches.
            return false;
        }
        const marketMatch = this.buy === other.sell && this.sell === other.buy;
        return marketMatch;
    }

    private toString(): string {
        return `Buy ${this.amountToBuy} ${this.buy} for ${this.sell}`;
    }

    static fromJson(msg: any): AddOrderMessage {
        const order = new AddOrderMessage();
        Object.assign(order, msg);
        return order;
    }
}
