import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
    {
        refreshTokenDb: {
            type: String,
            required: [true, "Token required"],
        },
        ip: {
            type: String,
            required: [true, "IP required"],
        },
        userAgent: {
            type: String,
            required: true,
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Token = mongoose.model("Token", TokenSchema);
