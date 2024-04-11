import { Request, Response } from "express";
import { DaBlog, DaCategory, DaUser } from "../dataAccess";
import { imageUploadToCloudinary } from "../services/cloudinary";

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const img = await imageUploadToCloudinary(req.file?.path);

    const obj = await DaCategory.create({
        name,
        icon: img.url,
    });

    return res.status(200).json({ data: obj, msg: "Category created" });
};

export const getAllCagories = async (req: Request, res: Response) => {
    const obj = await DaCategory.readAll({});
    return res.status(200).json({ data: obj, msg: "Category created" });
};
