import { CustomError, CustomErrorType } from './custom.error';

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, CustomErrorType.BadRequest);
    }
}
