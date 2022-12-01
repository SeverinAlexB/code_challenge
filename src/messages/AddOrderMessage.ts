import { BaseMessage } from "./BaseMessage";


export class AddOrderMessage extends BaseMessage {
    constructor() {
        super('AddOrderMessage');
    }
    public want: 'USD' | 'BTC' = 'BTC';
    public amount: number = 0;
}
