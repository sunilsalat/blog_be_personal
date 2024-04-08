import { ValidationError } from "express-validator";
import { BaseError } from "./baseError";

export class RequestValidationErrors extends BaseError {
    statusCode: number = 400;

    constructor(public errors: ValidationError[]) {
        super("");
    }

    serializeErrors(): { message: string; field?: string | undefined }[] {
        return this.errors.map((err: any) => {
            return { message: err.msg, field: err.path };
        });
    }
}
