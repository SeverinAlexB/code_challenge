export class BaseMessage {
    constructor(type: string) {
        this.type = type;
    }

    public type: string = '';
    public creatorId: number = -1;
    public creatorType: "server" | "client" | null = null;
    public createdAt: number = new Date().getTime();
}