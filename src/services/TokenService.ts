import createHttpError from "http-errors";
import { JwtPayload, sign } from "jsonwebtoken";
import { Config } from "../config";
import RefreshTokenSchema from "../models/RefreshTokenSchema";
import { UserData } from "../types";

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        const accessToken = sign(payload, Config.ACCESS_TOKEN_SECRET!, {
            expiresIn: "1y",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            expiresIn: "1y",
        });
        return refreshToken;
    }

    async storeRefreshToken(user: UserData) {
        try {
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1year
            const newRefreshToken = await RefreshTokenSchema.create({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });
            return newRefreshToken;
        } catch (err) {
            const error = createHttpError(500, "failed to store refresh token");
            throw error;
        }
    }
    async deleteRefreshToken(tokenId: string) {
        try {
            const result = await RefreshTokenSchema.deleteMany({
                _id: tokenId,
            });
            return result;
        } catch (err) {
            const error = createHttpError(
                500,
                "failed to delete refresh token",
            );
            throw error;
        }
    }
}
