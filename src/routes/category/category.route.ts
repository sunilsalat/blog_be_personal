import express from "express";
import * as CategoryController from "../../controllers/category.controller";
import { AuthMiddleware, ThrowValidationErrors } from "../../middlewares";
import multer from "multer";

const storage = multer.diskStorage({});
export const upload = multer({ storage });
const router = express.Router();

router.post(
    "/create",
    [upload.single("image"), AuthMiddleware],
    CategoryController.createCategory
);
router.post("/all", [], CategoryController.getAllCagories);

export default router;
