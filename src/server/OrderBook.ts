import { AddOrderMessage } from "../messages/AddOrderMessage";

export class OrderBook {
    private orders: AddOrderMessage[] = [];

    public add(order: AddOrderMessage) {
        this.orders.push(order); // Todo: Check for duplicates
    }

    public get(orderId: string): AddOrderMessage | undefined {
        const matches = this.orders.filter(order => order.id === orderId);
        if (matches.length === 0) {
            return undefined;
        }
        return matches[0];
    }

    public getMatches(orderId: string): AddOrderMessage[] {
        const order = this.get(orderId);
        if (!order) {
            return [];
        }
        return this.orders.filter(other => order?.isMatch(other));
    }
}