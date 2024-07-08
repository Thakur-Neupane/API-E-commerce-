import express from "express";
const router = express.Router();
import slugify from "slugify";
import {
  insertProduct,
  getAllProducts,
} from "../models/product/productModal.js";
import multerUpload from "../utils/uploadMulter.js";

router.post("/", multerUpload.array("images", 5), async (req, res, next) => {
  try {
    const { name } = req.body;

    const slug = slugify(name, {
      lower: true,
    });

    const prod = await insertProduct({ ...req.body, slug });
    if (prod?._id) {
      return res.json({
        status: "success",
        message: "New product has been added successfully.",
      });
    }

    res.json({
      status: "error",
      message: "Unable to add product, try again later",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate")) {
      error.message =
        "This product slug or sku already exist, please change the name of the product or sku and try agian.";
      error.statusCode = 400;
    }
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json({
      status: "success",
      message: "",
      products,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
