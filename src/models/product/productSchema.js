import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    categories: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    sales: {
      type: String,
      required: true,
    },

    salesStart: {
      type: String,
      required: true,
    },

    salesEnd: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
