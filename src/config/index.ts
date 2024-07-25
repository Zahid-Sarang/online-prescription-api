import { config } from "dotenv";
import path from "path";
config({
    path: path.join(
        __dirname,
        `../../.env.${process.env.NODE_ENV || "development"}`,
    ),
});

const {
    PORT,
    NODE_ENV,
    DB_URL,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    APP_URL,
    S3_ACCESS_KEY,
    S3_KEY_SECRET,
    S3_REGION,
    S3_Bucket,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_URL,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    APP_URL,
    S3_ACCESS_KEY,
    S3_KEY_SECRET,
    S3_REGION,
    S3_Bucket,
};
