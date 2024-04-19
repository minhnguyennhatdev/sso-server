import { Redis as _Redis } from "ioredis";
import { config } from "../configs/configuration";
import { SECOND_TO_MILLISECOND } from "../configs/constants";

export const Redis = new _Redis(config.REDIS_URL, {
    socketTimeout: SECOND_TO_MILLISECOND.FIVE,
    tls: {},
});
