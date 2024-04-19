export const config = {
    SERVICE: process.env.SERVICE || "sso-server",
    NODE_ENV: process.env.NODE_ENV || "dev",
    IS_PROD: process.env.NODE_ENV === "prod",

    REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",

    MONGODB_URL: process.env.MONGODB_URL ?? "mongodb://localhost:27017/sso",
};
