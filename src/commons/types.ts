import { HTTPStatus } from "../configs/constants";

export class Request<B = any, Q = any> {
    body: B;
    query: Q;
    params: any;
}

export class Response {
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    };
    statusCode: number;
    body: any;

    constructor({
        statusCode,
        message,
        data,
        code
    }: {
        statusCode: number;
        message?: string;
        data?: any;
        code?: string | number;
    }) {
        this.statusCode = statusCode ?? HTTPStatus.OK;
        this.body = JSON.stringify({
            statusCode: statusCode ?? 200,
            message: message ?? "ok",
            code,
            data,
        });
    }
}
