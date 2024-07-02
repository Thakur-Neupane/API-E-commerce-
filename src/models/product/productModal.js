import ProductSchema from "./productSchema.js";

export const insertProduct = (productObj) => {
  return ProductSchema(productObj).save();
};
