import bcrypt from "bcryptjs";
import _ from "lodash";
import { APIGatewayProxyResult } from "aws-lambda";
import { Request, Response } from "./../../commons/types";
import { HTTPStatus, OK } from "../../configs/constants";
import { config } from "../../configs/configuration";
import { UserModel } from "../../models/users";
import { Exceptions } from "./exceptions";

export const process = async (
    request: Request<{ username: string; password: string; rePassword: string }>
): Promise<APIGatewayProxyResult> => {
    const { body } = request;

    const { username, password, rePassword } = body;

    if (!username || !password || !rePassword) {
        return new Response({
            statusCode: HTTPStatus.BAD_REQUEST,
            message: "Username, password and rePassword are required",
            code: Exceptions.INVALID_INPUT,
        });
    }

    if (password !== rePassword) {
        return new Response({
            statusCode: HTTPStatus.BAD_REQUEST,
            message: "Password and rePassword must be the same",
            code: Exceptions.RE_PASSWORD_NOT_MATCH,
        });
    }

    const existedUser = await UserModel.exists({
        username,
    });

    if (existedUser) {
        return new Response({
            statusCode: HTTPStatus.BAD_REQUEST,
            message: "Username is already existed",
            code: Exceptions.USER_EXISTED,
        });
    }

    const hash = await bcrypt.hash(password, config.SALT);

    await UserModel.create({
        username,
        password: hash,
        name: username,
    });

    return new Response({
        statusCode: HTTPStatus.OK,
        data: OK,
    });
};
