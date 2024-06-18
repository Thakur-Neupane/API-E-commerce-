import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },

    role: {
      type: String,
      default: "user",
    },

    fName: {
      type: String,
      require: true,
      // maxLength: [100, "How can you have more than 100 characters First Name?"],
    },
    lName: {
      type: String,
      require: true,
      // maxLength: [100, "How can you have more than 100 characters Last Name?"],
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    refreshJWT: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
