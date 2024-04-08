import { User } from "../models";

export const create = async (data: any) => {
    const obj = await User.create(data);
    return obj;
};



export const update = async (filter: any, data: any) => {
    const obj = await User.findOneAndUpdate(filter, data, {
        new: true,
    });
    return obj;
};

export const read = async (filter: any) => {
    const obj = await User.findOne(filter);
    return obj;
};

export const readAll = async (filter: any) => {
    const obj = await User.find(filter);
    return obj;
};

export const remove = async (filter: any) => {
    const obj = await User.findOneAndDelete(filter);
    return obj;
};

export const removeAll = async (filter: any) => {
    const obj = await User.deleteMany({});
    return obj;
};
