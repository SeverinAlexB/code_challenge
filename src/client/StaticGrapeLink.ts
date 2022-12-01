// Hack to call one specific service enpoint because RPCClient doesnt support this.

export class StaticGrapeLink {
    constructor(public endpoint: string) { }

    public lookup(name: string, opts: any, callback: (res: any, endpoints: any[]) => any) {
        callback(null, [this.endpoint]);
    }
}