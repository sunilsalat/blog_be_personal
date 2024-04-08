import { validationResult } from "express-validator";
import { RequestValidationErrors } from "../errors/requestValidationError";
import { app } from "..";
import { Request, Response, NextFunction } from "express";

export const ThrowValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationErrors(errors.array());
    }

    next();
};
