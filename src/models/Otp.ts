import mongoose from "mongoose";
/* Can be a capped collection */

const OtpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Token required"],
        },
        email: { type: String },
        OTP: {
            type: Number,
            required: [true, "Otp required"],
        },
        expiresAt: {
            type: Number,
        },
        attempts: { type: Number, default: 0 },
        isValid: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const OTP = mongoose.model("OTP", OtpSchema);
