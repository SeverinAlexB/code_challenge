import { BaseMessage } from "./BaseMessage";


export class GetOrderMatchesMessage extends BaseMessage {
    public orderId: string = '';

    constructor() {
        super('GetOrderMatchesMessage');
    }
}
