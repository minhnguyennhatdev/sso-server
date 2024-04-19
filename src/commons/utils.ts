import { Request, Response } from "./types";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import fs from "fs";
import yaml from "js-yaml";
import { HTTPStatus } from "../configs/constants";
import { config } from "../configs/configuration";

export const readFile = (_path: string) => {
    return fs.readFileSync(_path, "utf8");
};

export const loadYaml = (_path: string) => {
    return yaml.load(readFile(_path));
};

export const parseServerlessEvent = (event: APIGatewayProxyEvent) => {
    const { queryStringParameters, body: _body, pathParameters } = event;
    return {
        query: queryStringParameters ?? {},
        body: JSON.parse(_body) ?? {},
        params: pathParameters ?? {},
    };
};

export const apiHandler =
    (process: (request: Request) => Promise<any>) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            console.log(config);
            const request: Request = parseServerlessEvent(event);
            console.log("request", request);
            const response = await process(request);
            console.log("response", response);
            return response;
        } catch (error) {
            console.error(error);
            return new Response({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        }
    };
