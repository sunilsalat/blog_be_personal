import { Category } from "../models";

export const create = async (data: any) => {
    const obj = await Category.create(data);
    return obj;
};

export const update = async (filter: any, data: any) => {
    const obj = await Category.findOneAndUpdate(filter, data, {
        new: true,
    });
    return obj;
};

export const read = async (filter: any) => {
    const obj = await Category.findOne(filter);
    return obj;
};

export const readAll = async (filter: any) => {
    const obj = await Category.find(filter);
    return obj;
};

export const remove = async (filter: any) => {
    const obj = await Category.findOneAndDelete(filter);
    return obj;
};

export const removeAll = async (filter:any) => {
    const obj = await Category.deleteMany({});
    return obj;
};
