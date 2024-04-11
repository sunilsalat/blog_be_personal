import { Request, Response } from "express";
import { DaBlog, DaCategory, DaUser } from "../dataAccess";
import { imageUploadToCloudinary } from "../services/cloudinary";
import { BadRequest, NotFound } from "../errors";
import { getPaginatedResult } from "../services/getPaginateResutl";
import { sendFeedBackEmail } from "../services/mailer";

export const createBlog = async (req: Request, res: Response) => {
    const { title, description, categoryId, tags } = req.body;

    const categoryObj = await DaCategory.read({ _id: categoryId });
    if (!categoryObj) {
        throw new BadRequest("You can not create blog");
    }

    const img = await imageUploadToCloudinary(req.file?.path);
    const images = [img.url];
    const obj = await DaBlog.create({
        createdByUser: req.userInfo.userId,
        title,
        description,
        categoryId,
        tags,
        images,
    });

    return res.status(200).json({ data: obj, msg: "Blog created" });
};

export const addLikeToPost = async (req: Request, res: Response) => {
    const { blogId } = req.body;
    const userObj = await DaUser.read({ _id: req.userInfo.userId });

    if (!userObj) {
        throw new BadRequest("You can not like this post");
    }

    const blogObj = await DaBlog.update(
        { _id: blogId, "likes.userId": { $ne: req.userInfo.userId } },
        {
            $addToSet: {
                likes: { likedBy: userObj._id, likedByName: userObj.name },
            },
            $inc: { totalLikes: 1 },
        }
    );

    return res.status(200).json({ data: null, msg: "liked added" });
};

export const addCommentToPost = async (req: Request, res: Response) => {
    const { text, blogId } = req.body;
    const userObj = await DaUser.read({ _id: req.userInfo.userId });

    if (!userObj) {
        throw new BadRequest("You can not like this post");
    }

    const blogObj = await DaBlog.update(
        { _id: blogId, "comments.userId": { $ne: req.userInfo.userId } },
        {
            $addToSet: { comments: { commentedBy: userObj._id, text: text } },
            $inc: { totalComments: 1 },
        }
    );

    return res.status(200).json({ data: null, msg: "comment added" });
};

export const getLandingPageBlog = async (req: Request, res: Response) => {
    let {
        categoryId,
        page,
        pageSize,
        onlyApproved,
        mostLikedFirst,
        mostCommentedFirst,
    } = req.body;
    page = page ? page : 1;
    pageSize = pageSize ? pageSize : 10;

    let filter: any = {};
    let orderBy: any = {};
    let populate: any = [];

    if (categoryId) {
        filter.categoryId = categoryId;
    }

    if (onlyApproved) {
        filter.isApprovedByAdmin = true;
    }

    if (mostCommentedFirst) {
        orderBy.totalComments = 1;
    }

    if (mostLikedFirst) {
        orderBy.totalLikes = 1;
    }

    const blogsObj = await DaBlog.readAll({
        filter,
        page,
        pageSize,
        populate,
        orderBy,
    });
    return res.status(200).json({ data: blogsObj, msg: "comment added" });
};

export const addAdminReview = async (req: Request, res: Response) => {
    let { blogId, isApproved, feedBack } = req.body;

    const blogObj = await DaBlog.update(
        { _id: blogId },
        { isApprovedByAdmin: isApproved, feedBack }
    );

    if (!blogId) {
        throw new NotFound("Blog not found");
    }

    if (!blogObj?.isApprovedByAdmin) {
        // TODO - send mail
    }

    return res.status(200).json({ data: null, msg: "feedback added" });
};
