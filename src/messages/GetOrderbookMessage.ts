import { BaseMessage } from "./BaseMessage";


export class GetOrderbookMessage extends BaseMessage {
    constructor() {
        super('GetOrderbookMessage');
    }
}
