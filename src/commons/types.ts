import { HTTPStatus } from "../configs/constants";

export class Request {
    params: any;
    body: any;
    query: any;
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
    }: {
        statusCode: number;
        code?: number;
        message?: string;
        data?: any;
    }) {
        this.statusCode = statusCode ?? HTTPStatus.OK;
        this.body = JSON.stringify({
            statusCode: statusCode ?? 200,
            message: message ?? "ok",
            data,
        });
    }
}
