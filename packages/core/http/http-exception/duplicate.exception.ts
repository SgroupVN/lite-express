import { CONFLICT } from 'http-status';
import { ERROR_CODE } from './error.enum';
import { HttpException } from './http.exception';

export class DuplicateException extends HttpException {
    constructor(msg = 'Duplicate record') {
        super(msg, ERROR_CODE.DUPLICATED, CONFLICT);
    }
}
