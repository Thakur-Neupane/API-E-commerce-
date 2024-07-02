import CategorySchema from "./CategorySchema.js";

export const insertCategory = (categoryObj) => {
  return CategorySchema(categoryObj).save();
};

export const getAllCategories = () => {
  return CategorySchema.find();
};

export const updateCategory = (_id, obj) => {
  return CategorySchema.findByIdAndUpdate(_id, obj);
};

export const deleteCategory = (_id) => {
  console.log(_id, "chhhh");
  return CategorySchema.findByIdAndDelete({ _id });
};

// export const deleteManyCategory = (filter) => {
//   return CategorySchema.deleteMany(filter);
// };
