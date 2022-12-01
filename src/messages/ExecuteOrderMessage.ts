import { BaseMessage } from "./BaseMessage";
import { v4 as uuidv4 } from 'uuid';

export class ExecuteOrderMessage extends BaseMessage {
    public orderId: string = uuidv4();
    constructor() {
        super('ExecuteOrderMessage');
    }
}
