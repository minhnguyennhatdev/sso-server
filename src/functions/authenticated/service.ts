import { APIGatewayProxyResult } from "aws-lambda";
import { Request, Response } from "./../../commons/types";
import { HTTPStatus } from "../../configs/constants";
import { Redis } from "../../databases/redis";

export const process = async (
    request: Request
): Promise<APIGatewayProxyResult> => {
    const { query } = request;

    const { token } = query;

    const cachedToken = await Redis.get(token);
    if (!cachedToken) {
        return new Response({
            statusCode: HTTPStatus.UNAUTHORIZED,
            message: "Unauthorized",
        });
    }

    await Redis.del(token);

    const user = JSON.parse(cachedToken);

    return new Response({
        statusCode: 200,
        data: user,
    });
};
