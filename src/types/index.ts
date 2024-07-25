import { Request } from "express";
import mongoose from "mongoose";

export interface UserData {
    _id?: mongoose.Types.ObjectId;
    profilePicture?: string;
    name: string;
    specialty?: string;
    email: string;
    phoneNumber: string;
    yearsOfExperience?: mongoose.Types.Decimal128;
    age?: number;
    historyOfSurgery?: string;
    historyOfIllness?: string;
    role: "doctor" | "patient";
    password: string;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}

export interface IRefreshTokenPayload {
    id: string;
}
