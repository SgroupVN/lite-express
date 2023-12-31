import { UNPROCESSABLE_ENTITY } from 'http-status';
import { ERROR_CODE } from './error.enum';
import { HttpException } from './http.exception';

export class UnprocessableEntityException extends HttpException {
    constructor(msg = 'Unprocessable Entity') {
        super(msg, ERROR_CODE.UNPROCESSABLE_ENTITY, UNPROCESSABLE_ENTITY);
    }
}
