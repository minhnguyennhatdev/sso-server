import bcrypt from "bcryptjs";
import _ from "lodash";
import { APIGatewayProxyResult } from "aws-lambda";
import crypto from "crypto";
import { Request, Response } from "./../../commons/types";
import { UserModel } from "../../models/users";
import { connectMongo } from "../../databases/mongodb";
import { HTTPStatus, MINUTE_TO_SECOND } from "../../configs/constants";
import { loadYaml } from "../../commons/utils";
import { UserDTO } from "./dtos/user";
import { Redis } from "../../databases/redis";


export const process = async (
    request: Request
): Promise<APIGatewayProxyResult> => {

    const { body, query } = request;

    const { state: _state } = query;
    
    if (!_state) {
        return new Response({
            status: HTTPStatus.FORBIDDEN,
            message: "Unauthorized redirect URL",
        });
    }

    const state = _state
        ? JSON.parse(Buffer.from(_state, "base64").toString())
        : {};
    const { redirectUrl } = state;
    const SSO = loadYaml("sso.yml");

    if (!state || !SSO?.redirectUrls?.includes(redirectUrl)) {
        return new Response({
            status: HTTPStatus.FORBIDDEN,
            message: "Unauthorized redirect URL",
        });
    }

    const { username, password } = body;

    if (!(username?.length > 0) || !(password?.length > 0)) {
        return new Response({
            status: HTTPStatus.BAD_REQUEST,
            message: "Username and password are required",
        });
    }

    await connectMongo();

    const user = await UserModel.findOne({
        username,
    })
        .select("-__v")
        .lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Response({
            status: HTTPStatus.UNAUTHORIZED,
            message: "Wrong username or password",
        });
    }

    const randomHash = crypto.randomBytes(32).toString("hex");

    console.log("randomHash", randomHash);

    await Redis.setex(
        randomHash,
        MINUTE_TO_SECOND.FIVE,
        JSON.stringify(new UserDTO(user))
    );

    console.log(JSON.stringify(new UserDTO(user)));

    const redirect = `${redirectUrl}?token=${randomHash}`;

    console.log("redirect", redirect);

    console.log(
        new Response({
            status: 200,
            data: {
                redirect,
            },
        })
    );

    return new Response({
        status: 200,
        data: {
            redirect,
        },
    });
};