import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/baseError";

export const ErrorHandlerMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log({ err });

    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            error: err.serializeErrors(),
        });
    }

    return res.status(500).json({
        error: [{ message: err.message }] || [
            { message: "Internal server error, Something went wrong!" },
        ],
    });
};
