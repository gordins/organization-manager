export class CustomError extends Error {
    constructor(
        message: string,
        public type: CustomErrorType
    ) {
        super(message);
    }
}

export enum CustomErrorType {
    BadRequest = 'BadRequest',
    Unhandled = 'UNHANDLED'
}
