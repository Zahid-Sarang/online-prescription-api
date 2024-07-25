import mongoose from "mongoose";
import { Config } from ".";
import logger from "./logger";

async function DbConnect() {
    try {
        const URL = Config.DB_URL as string; // Assuming DB_URL is a required environment variable

        // Database connection
        await mongoose.connect(URL);

        const db = mongoose.connection;

        db.on("error", (err) => {
            logger.error(`MongoDB connection error: ${err}`);
        });

        db.once("open", () => {
            logger.info("Connected to DB");
        });
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error as string}`);
    }
}

export default DbConnect;
