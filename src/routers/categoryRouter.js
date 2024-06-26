import express from "express";
const router = express.Router();
import slugify from "slugify";
import {
  deleteCategory,
  getAllCategories,
  insertCategory,
  updateCategory,
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

      if (cat?._id) {
        return res.json({
          status: "success",
          message: "New category has been added",
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to add category, try again later",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate")) {
      error.message =
        "This category slug already exist, please change the name of the Category and try agian.";
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
      message: "New category has been added",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const category = await updateCategory(_id, req.body);

    category?._id
      ? res.json({
          status: "success",
          message: "Category has been edited",
        })
      : res.json({
          status: "error",
          message: "Sorry , failed to edit category. Try again later.",
        });
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id?", async (req, res, next) => {
  try {
    console.log(req.params);
    const { _id } = req.params;
    console.log(_id);
    const category = await deleteCategory(_id);

    category?._id
      ? res.json({
          status: "success",
          message: "Category has been deleted successfully.",
        })
      : res.json({
          status: "error",
          message: "Sorry , failed to delete Category. Try again later.",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
