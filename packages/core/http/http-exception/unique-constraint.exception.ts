import { CONFLICT } from 'http-status';
import { ERROR_CODE } from './error.enum';
import { HttpException } from './http.exception';

export class UniqueConstraintException extends HttpException {
    constructor(msg = 'Conflict references id') {
        super(msg, ERROR_CODE.UNIQUE_CONSTRAINT, CONFLICT);
    }
}
