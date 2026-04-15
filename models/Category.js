const mongoose = require("mongoose");
const joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

// validate create category

function validateCreateCategory(category) {
  const schema = joi.object({
    title: joi.string().min(3).max(50).required(),
  });
  return schema.validate(category);
}

module.exports = {
  Category,
  validateCreateCategory,
};
