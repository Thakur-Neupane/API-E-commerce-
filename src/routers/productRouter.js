import express from "express";
const router = express.Router();
import slugify from "slugify";
import { insertProduct } from "../models/product/productModal";

router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (typeof title === "string" && title.length) {
      const slug = slugify(title, {
        lower: true,
      });

      const productObj = await insertProduct({
        name,
        slug,
        sku,
        price,
        qty,
        sales,
        category,
        salesStart,
        salesEnd,
        Description,
      });

      if (productObj?._id) {
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
        "This product already exist, please change the name of the Category and try agian.";
      error.statusCode = 200;
    }
    next(error);
  }
});
export default router;
