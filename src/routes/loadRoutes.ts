import { app } from "..";
import { AuthMiddleware } from "../middlewares";
import UserRoute from "./auth/auth.route";
import BlogRoute from "./blog/blog.routes";
import CategoryRoute from "./category/category.route";

export const loadRoutes = () => {
    app.use("/api/v1/user", [], UserRoute);
    app.use("/api/v1/blog", [], BlogRoute);
    app.use("/api/v1/category", [], CategoryRoute);
};
