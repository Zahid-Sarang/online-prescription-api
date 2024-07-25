import express, { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserServices";
import { AuthRequest, RegisterUserRequest } from "../types";
import loginValidators from "../validators/login-validators";
import registerValidators from "../validators/register-validators";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middleware/authenticate";
import validateRefreshToken from "../middleware/validateRefreshToken";
import { canAccess } from "../middleware/canAccess";
import { S3Storage } from "../services/S3Storage";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import parseRefreshToken from "../middleware/parseRefreshToken";

const router = express.Router();

const userService = new UserService();
const tokenService = new TokenService();
const credentialsService = new CredentialService();
const s3Storage = new S3Storage();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialsService,
    s3Storage,
);

// Create Users Route (patient and doctor)
router.post(
    "/register",
    fileUpload({
        limits: { fileSize: 5000 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(
                400,
                "File Size exceeds the maximum limit",
            );
            next(error);
        },
    }),
    registerValidators,
    (req: RegisterUserRequest, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    "/login",
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

router.get(
    "/self",
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        authController.self(req as AuthRequest, res, next),
);

router.post(
    "/refresh",
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
);

router.get(
    "/getDoctors",
    authenticate,
    canAccess(["patient"]),
    (req: Request, res: Response, next: NextFunction) =>
        authController.getUser(req, res, next),
);

router.post(
    "/logout",
    authenticate,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequest, res, next),
);

export default router;
