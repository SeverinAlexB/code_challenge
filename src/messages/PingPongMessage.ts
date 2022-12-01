import { BaseMessage } from "./BaseMessage";


export class PingPongMessage extends BaseMessage {
    constructor() {
        super('PingPongMessage');
    }
    public message: 'ping' | 'pong' = 'ping';
}
