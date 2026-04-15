const mongoose = require("mongoose");
const joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: "",
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

const Post = mongoose.model("Post", postSchema);

function validateCreatePost(post) {
  const schema = joi.object({
    title: joi.string().min(5).max(255).required(),
    description: joi.string().min(5).max(1024).required(),
    category: joi.string().min(3).max(50).required(),
  });
  return schema.validate(post);
}

function validateUpdatePost(post) {
  const schema = joi.object({
    title: joi.string().min(5).max(255),
    description: joi.string().min(5).max(1024),
    category: joi.string().min(3).max(50),
  });
  return schema.validate(post);
}

module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
};
