import { NextFunction, Request, Response } from "express";
import { NotAuthorize } from "../errors";
import { CommonClass } from "../services/common";
import { DaToken } from "../dataAccess";
const common = new CommonClass();

export const AuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { access_token, refresh_token } = req.signedCookies;

        if (!refresh_token) {
            throw new NotAuthorize("Not Authorize to access page!");
        }

        if (access_token) {
            const payload = common.verifyPayload(access_token);
            req.userInfo = payload;
            next();
            return;
        }

        const data: any = common.verifyPayload(refresh_token);
        const { id, name, email, role, refreshTokenDb } = data;
        const token: any = await DaToken.read({ userId: id });
        if (!token || !token.is_valid) {
            throw new NotAuthorize("Not Authorize to access page!");
        }

        common.createJwtTokenAndAttachCookieToRes({
            res,
            payload: { id, name, email, role },
            refreshTokenDb: data.refresh_token,
        });

        req.userInfo = { id, name, email, role };
        next();
    } catch (error) {
        // log and throw error
        console.log(`Error in auth - ${error}`);
        throw new NotAuthorize("Not authorize");
    }
};

export const isAllowed = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { id, name, email, role } = req.userInfo;
        if (!roles.includes(role)) {
            throw new NotAuthorize(
                "You dont have right to perform this action"
            );
        }
        next();
    };
};
