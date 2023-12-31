import { FORBIDDEN } from 'http-status';
import { HttpException } from './http.exception';
import { ERROR_CODE } from './error.enum';

export class ForbiddenException extends HttpException {
    constructor(msg = 'You don not have permission to access this resource') {
        super(msg, ERROR_CODE.FORBIDDEN, FORBIDDEN);
    }
}
