import mongoose from "mongoose";
import { config } from "../configs/configuration";
import { SECOND_TO_MILLISECOND } from "../configs/constants";

const MONGODB_URL = config.MONGODB_URL;

mongoose.set('debug', !config.IS_PROD)

export const connectMongo = async () => {
    try {
        console.log("Connecting to MongoDB");
        await mongoose.connect(MONGODB_URL, {
            connectTimeoutMS: SECOND_TO_MILLISECOND.FIVE,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};
