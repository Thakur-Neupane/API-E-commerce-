import express from "express";
const router = express.Router();
import slugify from "slugify";
import {
  getAllCategories,
  insertCategory,
} from "../models/category/CategoryModel.js";

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (typeof title === "string" && title.length) {
      const slug = slugify(title, {
        lower: true,
      });
      const cat = await insertCategory({
        title,
        slug,
      });
    }
    res.status({
      status: "success",
      message: "New Category has Been added.",
    });

    res.status({
      status: "success",
      message: "TODO",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate")) {
      error.message =
        "This category slug already exist, please try with another title with changing category title";
      error.statusCode = 200;
    }
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.json({
      status: "success",
      message: "New Category has Been added.",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
