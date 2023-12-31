import { CustomError, CustomErrorType } from './custom.error';

export class UnhandledError extends CustomError {
    constructor(message: string) {
        super(message, CustomErrorType.Unhandled);
    }
}
