import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserServices";
import { AuthRequest, RegisterUserRequest } from "../types";
import { FileStorage } from "../types/storage";
import { UploadedFile } from "express-fileupload";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialsService: CredentialService,
        private storage: FileStorage,
    ) {}

    private generateCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ) {
        res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
        });
    }

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ error: validationError.array() });
        }

        // Create a new users
        // upload image to s3 bucket
        const image = req.files!.profilePicture as UploadedFile;
        const imageName = uuidv4();
        await this.storage.upload({
            fileName: imageName,
            fileData: image.data.buffer,
        });

        const {
            name,
            specialty,
            email,
            password,
            phoneNumber,
            yearsOfExperience,
            age,
            historyOfSurgery,
            historyOfIllness,
            role,
        } = req.body;

        // Save users in database
        try {
            const user = await this.userService.create({
                profilePicture: imageName,
                name,
                specialty,
                email,
                password,
                phoneNumber,
                yearsOfExperience,
                age,
                historyOfSurgery,
                historyOfIllness,
                role,
            });
            this.logger.info("User has been registered");

            // token payload
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            // generate accessToken
            const accessToken = this.tokenService.generateAccessToken(payload);

            // store refresh token
            const newRefreshToken =
                await this.tokenService.storeRefreshToken(user);

            // generate accessToken
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken._id),
            });
            // send httpOnly cookies
            this.generateCookies(res, accessToken, refreshToken);

            res.status(201).json({ user });
        } catch (error) {
            next(error);
        }
    }

    // Login Endpoint
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // validation
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ errors: validationError.array() });
        }
        const { email, password } = req.body;
        this.logger.debug("New request to register a user:", {
            email,
            password: "******",
        });

        try {
            // check user exist in database or not
            const user = await this.userService.findByEmailWithPassword(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    "Email and password dosn't match!",
                );
                next(error);
                return;
            }

            // compare password
            const passwordMatch = await this.credentialsService.comparePassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    "Email and password dosn't match!",
                );
                next(error);
                return;
            }
            // generate token
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            // generate accessToken
            const accessToken = this.tokenService.generateAccessToken(payload);

            // store refresh token
            const newRefreshToken =
                await this.tokenService.storeRefreshToken(user);

            // generate accessToken
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken._id),
            });

            // send httpOnly cookies
            this.generateCookies(res, accessToken, refreshToken);
            res.json({ id: user._id });
        } catch (err) {
            next(err);
            return;
        }
    }

    // Get Self Information
    async self(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userInfo = await this.userService.findById(req.auth.sub);
            if (!userInfo) {
                // Handle the case where the user is not found
                return res.status(404).json({ message: "User not found" });
            }

            res.json(userInfo);
        } catch (err) {
            next(err);
        }
    }

    // Refresh Tokens
    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            };

            const user = await this.userService.findById(req.auth.sub);
            if (!user) {
                const error = createHttpError(
                    400,
                    "User with token could not find",
                );
                next(error);
                return;
            }
            // generate accessToken
            const accessToken = this.tokenService.generateAccessToken(payload);

            // store refresh token
            const newRefreshToken =
                await this.tokenService.storeRefreshToken(user);

            // generate accessToken
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken._id),
            });

            // delete old refresh token
            await this.tokenService.deleteRefreshToken(req.auth.id as string);

            this.generateCookies(res, accessToken, refreshToken);
            res.json({ id: user._id });
        } catch (err) {
            next(err);
        }
    }

    // get Doctors information
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const usersList = await this.userService.getUsersList();
            res.json(usersList);
        } catch (err) {
            next(err);
        }
    }
}
