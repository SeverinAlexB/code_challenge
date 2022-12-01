import { AddOrderMessage } from "./AddOrderMessage";
import { BaseMessage } from "./BaseMessage";


export class GetOrderbookResponse extends BaseMessage {
    public orders: AddOrderMessage[] = [];
    constructor() {
        super('GetOrderbookResponse');
    }
}
