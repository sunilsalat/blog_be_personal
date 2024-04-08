import { Blog } from "../models";
import { getPaginatedResult } from "../services/getPaginateResutl";

export const create = async (data: any) => {
  const obj = await Blog.create(data);
  return obj;
};

export const update = async (filter: any, data: any) => {
  const obj = await Blog.findOneAndUpdate(filter, data, {
    new: true,
  });
  return obj;
};

export const read = async (filter: any) => {
  const obj = await Blog.findOne(filter);
  return obj;
};

export const readAll = async (query: any) => {
  const { filter, populate, select, page, pageSize, orderBy } = query;
  const objs = await getPaginatedResult({
    modelname: Blog,
    filter,
    populate,
    select,
    page,
    pageSize,
    order_by: orderBy,
  });
  return objs;
};

export const remove = async (filter: any) => {
  const obj = await Blog.findOneAndDelete(filter);
  return obj;
};

export const removeAll = async (filter: any) => {
  const obj = await Blog.deleteMany({});
  return obj;
};
