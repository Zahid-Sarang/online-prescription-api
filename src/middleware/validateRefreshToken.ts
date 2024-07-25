import { Request } from "express";
import { expressjwt } from "express-jwt";
import { ObjectId } from "mongodb";
import { Config } from "../config";
import logger from "../config/logger";
import RefreshTokenSchema from "../models/RefreshTokenSchema";
import { AuthCookie, IRefreshTokenPayload } from "../types";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
    async isRevoked(request: Request, token) {
        try {
            const refreshToken = await RefreshTokenSchema.findOne({
                _id: new ObjectId((token?.payload as IRefreshTokenPayload).id),
                user: { _id: token?.payload.sub },
            }).exec();

            return refreshToken === null;
        } catch (err) {
            logger.error("Error while getting the refresh token", {
                id: (token?.payload as IRefreshTokenPayload).id,
            });
            return true;
        }
    },
});
