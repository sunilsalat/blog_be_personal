import express from "express";
import * as BlogController from "../../controllers/blog.controller";
import { AuthMiddleware, ThrowValidationErrors } from "../../middlewares";
import multer from "multer";
import { isAllowed } from "../../middlewares/checkAuth";



const storage = multer.diskStorage({});
export const upload = multer({ storage });
const router = express.Router();

router.post("/create", [upload.single('image'), AuthMiddleware], BlogController.createBlog);
router.post("/like", [AuthMiddleware], BlogController.addLikeToPost);
router.post("/comment", [AuthMiddleware], BlogController.addCommentToPost);
router.post("/all", [AuthMiddleware], BlogController.getLandingPageBlog);
router.post("/feedback", [AuthMiddleware, isAllowed(['ADMIN'])], BlogController.addAdminReview);


export default router;
