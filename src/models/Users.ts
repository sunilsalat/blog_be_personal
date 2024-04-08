import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      // user name
      type: String,
    },
    email: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
