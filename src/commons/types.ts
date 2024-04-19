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
        status,
        message,
        data,
    }: {
        status: number;
        code?: number;
        message?: string;
        data?: any;
    }) {
        this.statusCode = status ?? HTTPStatus.OK;
        this.body = JSON.stringify({
            status: status ?? 200,
            message: message ?? "ok",
            data,
        });
    }
}
