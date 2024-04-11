import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        icon: {
            type: String,
            required: [true, "Icon is required"],
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
