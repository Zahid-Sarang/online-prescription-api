import app from "./app";
import { Config } from "./config";
import DbConnect from "./config/dbConfig";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT;
    await DbConnect();
    logger.info("DataBase connected successfully!");
    try {
        app.listen(PORT, () => {
            logger.info(`Listing on port ${PORT}`);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
