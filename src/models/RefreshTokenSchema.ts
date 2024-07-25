import mongoose, { Schema } from "mongoose";

const refreshSchema = new Schema({
    expiresAt: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Refresh_Token", refreshSchema, "Refresh_Tokens");
