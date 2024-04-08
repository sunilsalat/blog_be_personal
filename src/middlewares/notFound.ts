import { Request, Response } from "express";

export const NotFoundHandler = (req: Request, res: Response) => {
    return res.status(404).send("Page you are looking for not found!");
};
