import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema); //category
