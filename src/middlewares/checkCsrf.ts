import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../errors";

// add in route where formdata is expected to prevent csrf attacks

export const checkCSRF = (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientCsrfToken = req.get("X-CSRF-Token"); // TODO - get from body optional
        const serverCsrfToken = req.signedCookies.csrf_token;

        if (
            !clientCsrfToken ||
            !serverCsrfToken ||
            clientCsrfToken !== serverCsrfToken
        ) {
            throw new BadRequest("Invalid request");
        }
    } catch (error) {
        throw error;
    }

    next();
};
