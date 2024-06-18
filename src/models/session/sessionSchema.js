import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      require: true,
    },
    associate: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Session", sessionSchema);
