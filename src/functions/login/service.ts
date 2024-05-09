import bcrypt from "bcryptjs";
import _ from "lodash";
import { APIGatewayProxyResult } from "aws-lambda";
import crypto from "crypto";
import { Request, Response } from "./../../commons/types";
import { UserModel } from "../../models/users";
import { HTTPStatus, MINUTE_TO_SECOND } from "../../configs/constants";
import { loadYaml } from "../../commons/utils";
import { UserDTO } from "./dtos/user";
import { Redis } from "../../databases/redis";
import { Exceptions } from "./exceptions";

export const process = async (
    request: Request
): Promise<APIGatewayProxyResult> => {
    const { body, query } = request;

    const { state: _state = null } = query;

    if (!_state) {
        return new Response({
            statusCode: HTTPStatus.FORBIDDEN,
            message: "Unauthorized redirect URL",
            code: Exceptions.FORBIDDEN_RESOURCE,
        });
    }

    const state = _state
        ? JSON.parse(Buffer.from(_state, "base64").toString())
        : {};
    const { redirectUrl } = state;
    const SSO = loadYaml("sso.yml");

    if (!state || !SSO?.redirectUrls?.includes(redirectUrl)) {
        return new Response({
            statusCode: HTTPStatus.FORBIDDEN,
            message: "Unauthorized redirect URL",
            code: Exceptions.FORBIDDEN_RESOURCE,
        });
    }

    const { username, password } = body;

    if (!(username?.length > 0) || !(password?.length > 0)) {
        return new Response({
            statusCode: HTTPStatus.BAD_REQUEST,
            message: Exceptions.INVALID_INPUT,
        });
    }

    const user = await UserModel.findOne({
        username,
    })
        .select("-__v")
        .lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Response({
            statusCode: HTTPStatus.UNAUTHORIZED,
            message: "Wrong username or password",
            code: Exceptions.INVALID_CREDENTIALS,
        });
    }

    const randomHash = crypto.randomBytes(32).toString("hex");

    await Redis.setex(
        randomHash,
        MINUTE_TO_SECOND.FIVE,
        JSON.stringify(new UserDTO(user))
    );

    const redirect = `${redirectUrl}?token=${randomHash}`;

    return new Response({
        statusCode: HTTPStatus.OK,
        data: {
            redirect,
        },
    });
};
