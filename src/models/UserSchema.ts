import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
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

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        profilePicture: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        specialty: {
            type: String,
            trim: true,
            required: function (this: IUser) {
                return this.role === "doctor";
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "is invalid"],
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10}$/, "is invalid"],
        },
        yearsOfExperience: {
            type: mongoose.Schema.Types.Decimal128,
            required: function (this: IUser) {
                return this.role === "doctor";
            },
            min: 0,
        },
        age: {
            type: Number,
            required: function (this: IUser) {
                return this.role === "patient";
            },
            min: 0,
        },
        historyOfSurgery: {
            type: String,
            trim: true,
            required: function (this: IUser) {
                return this.role === "patient";
            },
        },
        historyOfIllness: {
            type: String,
            trim: true,
            required: function (this: IUser) {
                return this.role === "patient";
            },
        },
        role: {
            type: String,
            required: true,
            enum: ["doctor", "patient"],
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 }, { unique: true });

// Model initialization
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
