import { DaBlog, DaCategory, DaUser } from "../dataAccess";
import fs from "fs";
import path from "path";

export const seedData = async () => {
  await DaUser.removeAll({});
  await DaCategory.removeAll({});
  await DaBlog.removeAll({});

  // seeding
  const userData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./blog_app.users.json"), "utf8")
  );
  await DaUser.create(userData);

  const catData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./blog_app.categories.json"), "utf8")
  );
  await DaCategory.create(catData);

  const blogData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./blog_app.blogs.json"), "utf8")
  );

  await DaBlog.create(blogData);
};
