import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import User from "../models/UserSchema";
import { UserData } from "../types";
export class UserService {
    constructor() {}
    async create({
        profilePicture,
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
    }: UserData) {
        // check if user already exists
        const isEmailExsit = await User.findOne({ email: email });
        if (isEmailExsit) {
            const err = createHttpError(400, "Email is already exists!");
            throw err;
        }

        // Hashed the password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);
        try {
            return await User.create({
                profilePicture,
                name,
                specialty,
                email,
                password: hashedPassword,
                phoneNumber,
                yearsOfExperience,
                age,
                historyOfSurgery,
                historyOfIllness,
                role,
            });
        } catch (err) {
            const error = createHttpError(500, "failed to create user");
            throw error;
        }
    }

    async findByEmailWithPassword(email: string) {
        return await User.findOne({ email: email });
    }

    async findById(id: string) {
        return await User.findById(id).select(["-password", "-__v"]);
    }

    async getUsersList() {
        return await User.find({ role: "doctor" });
    }
}
