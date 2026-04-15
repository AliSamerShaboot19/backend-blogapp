const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category.js");
const { Post } = require("../models/Post");

// @desc Create New Category
// @method Post /api/categories
// @access private (only admin)
const createCategory = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });
  res.status(201).json(category);
});

// @desc get all categories
// @method Get /api/categories
// @access public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// @desc delete category
// @method delete /api/categories/:id
// @access private (only admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await Category.findByIdAndDelete(req.params.id);

  await Post.deleteMany({ category: category.title });

  return res.status(200).json({
    message: "Category deleted successfully",
    categoryId: req.params.id,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
