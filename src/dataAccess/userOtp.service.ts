import { OTP } from "../models";

export const create = async (data: any) => {
    const obj = await OTP.create(data);
    return obj;
};

export const read = async (filter: any, sort?: any) => {
    const obj = await OTP.findOne(filter).sort(sort);
    return obj;
};

export const readAll = async (filter: any, sort?: any) => {
    const obj = await OTP.find(filter).sort(sort);
    return obj;
};

export const update = async (filter: any, data: any) => {
    const obj = await OTP.findOneAndUpdate();
    return obj;
};

export const remove = async (filter: any) => {
    const obj = await OTP.findOneAndDelete(filter);
    return obj;
};

export const removeAll = async (filter: any) => {
    const obj = await OTP.deleteMany(filter);
    return obj;
};
