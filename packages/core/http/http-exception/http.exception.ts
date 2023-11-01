export class HttpException extends Error {
    code: string;

    status: number;

    constructor(msg: string, code: string, status: number) {
        super(msg);
        this.code = code;
        this.status = status;
    }
}
