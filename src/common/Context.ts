export class Context {
    timestamp: number;

    constructor(public runtime?: Runtime) {
        this.timestamp = Date.now();
    }
}

export enum Runtime {
    Server = 'SERVER',
    Migration = 'MIGRATION'
}
