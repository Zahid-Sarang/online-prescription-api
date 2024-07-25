import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

import logger from "./config/logger";
import authRouter from "./routes/auth";
import consultationRouter from "./routes/Consultation";
import { Config } from "./config";

const app = express();
const corsOptions = {
    credentials: true,
    origin: Config.FRONTEND_URL,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.get("/", async (req, res) => {
    res.send("welcome to the app");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/consultation", consultationRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
