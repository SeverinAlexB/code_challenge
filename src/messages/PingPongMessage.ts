import { BaseMessage } from "./BaseMessage";


export class PingPongMessage extends BaseMessage {
    constructor(type: 'ping' | 'pong') {
        super('PingPongMessage');
        this.message = type;
    }
    public message: 'ping' | 'pong';
}
