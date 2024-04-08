import crypto from "crypto";
import { Token } from "../models";

export const create = async (data: any) => {
    const obj = await Token.create(data);
    return obj;
};

export const update = async (filter: any, data: any) => {
    const obj = await Token.findOneAndUpdate(filter, data, {
        new: true,
    });
    return obj;
};

export const read = async (filter: any) => {
    const obj = await Token.findOne(filter);
    return obj;
};

export const readAll = async (filter: any) => {
    const obj = await Token.find(filter);
    return obj;
};

export const remove = async (filter: any) => {
    const obj = await Token.findOneAndDelete(filter);
    return obj;
};

export const readOrCreate = async (data: any) => {
    try {
        const { user, ip, userAgent } = data;

        let token = await Token.findOne({
            userId: user._id,
        });

        if (token) {
            return token;
        }

        const tokenPayload = {
            refreshTokenDb: crypto.randomBytes(40).toString("hex"),
            ip: ip,
            userAgent: userAgent,
            userId: user._id,
        };

        token = await Token.create(tokenPayload);

        return token;
    } catch (error) {
        throw error;
    }
};
