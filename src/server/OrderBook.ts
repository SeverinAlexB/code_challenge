import { AddOrderMessage } from "../messages/AddOrderMessage";

export class OrderBook {
    public orders: AddOrderMessage[] = [];

    public add(order: AddOrderMessage) {
        if (this.get(order.id)) {
            return;
        }
        this.orders.push(order);
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