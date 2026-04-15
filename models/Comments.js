const mongoose = require("mongoose");
const joi = require("joi");
const User = require("./User");
const Post = require("./Post");

// Comment schema

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// comment model

const Comment = mongoose.model("Comment", commentSchema);

// validation function for comment

function validateCreateComment(comment) {
  const schema = joi.object({
    postId: joi.string().required(),
    text: joi.string().required(),
  });
  return schema.validate(comment);
}

// validation function for updating comment

function validateUpdateComment(comment) {
  const schema = joi.object({
    text: joi.string().required(),
  });
  return schema.validate(comment);
}

module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};
