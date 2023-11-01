import { BAD_REQUEST } from 'http-status';
import { HttpException } from './http.exception';
import { ERROR_CODE } from './error.enum';

export class BadRequestException extends HttpException {
    constructor(msg = 'Bad request') {
        super(msg, ERROR_CODE.BAD_REQUEST, BAD_REQUEST);
    }
}
