import CategorySchema from "./CategorySchema.js";

export const insertCategory = (CategoryObj) => {
  return CategorySchema(CategoryObj).save();
};

export const getAllCategories = (filter) => {
  return CategorySchema.findOne(filter);
};

export const getCategory = (filter) => {
  return CategorySchema.findOne(filter);
};

// export const deleteCategory = (filter) => {
//   return CategorySchema.findOneAndDelete(filter);
// };

// export const deleteManyCategory = (filter) => {
//   return CategorySchema.deleteMany(filter);
// };
