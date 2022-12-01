import { BaseMessage } from "./BaseMessage";
import { v4 as uuidv4 } from 'uuid';

export class ExecuteOrderResponse extends BaseMessage {
    public orderId: string = uuidv4();
    public lightningInvoice: string = '';
    public exiresAt: number = 0; // epoch

    constructor() {
        super('ExecuteOrderResponse');
    }
}
