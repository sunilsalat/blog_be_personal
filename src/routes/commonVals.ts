import { body } from "express-validator";

export const commonVals = {
    string: (field: string, msg: string, min?: number, max?: number) =>
        body(field)
            .trim()
            .notEmpty()
            .escape()
            .isString()
            .isLength({ min, max })
            .withMessage(msg),

    lastName: (field: string, msg: string) =>
        body(field).trim().notEmpty().escape().withMessage(msg),

    mongoId: (field: string, msg: string) =>
        body(field).isMongoId().withMessage(msg),

    number: (field: string, msg: string, min = 0, max = 9999) =>
        body(field).notEmpty().isInt({ min, max }).withMessage(msg),

    phone: (field: string, msg: string) =>
        body(field)
            .trim()
            .notEmpty()
            .escape()
            .isMobilePhone("en-IN")
            .withMessage(msg),

    email: (field: string, msg: string) =>
        body(field).trim().notEmpty().escape().isEmail().withMessage(msg),

    date: (field: string, msg: string) => body(field).isDate().withMessage(msg),

    address: () => {
        return [
            body("address.landmark")
                .trim()
                .notEmpty()
                .escape()
                .isString()
                .withMessage("landmark is required"),
            body("address.city")
                .trim()
                .notEmpty()
                .escape()
                .isString()
                .withMessage("city is required"),
            body("address.state")
                .trim()
                .notEmpty()
                .escape()
                .isString()
                .withMessage("state is required"),
            body("address.country")
                .trim()
                .notEmpty()
                .escape()
                .isString()
                .withMessage("country is required"),
            body("address.zipcode")
                .trim()
                .notEmpty()
                .escape()
                .isString()
                .withMessage("zipcode is required"),
            body("address.location.lat")
                .trim()
                .escape()
                .isLatLong()
                .optional({ checkFalsy: true, nullable: true })
                .withMessage("lat is required"),
            body("address.location.long")
                .trim()
                .escape()
                .isLatLong()
                .optional({ checkFalsy: true, nullable: true })
                .withMessage("long is required"),
        ];
    },
};
