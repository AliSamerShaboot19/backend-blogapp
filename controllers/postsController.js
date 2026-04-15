const fs = require("fs");
const path = require("path");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post.js");
const asyncHandler = require("express-async-handler");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary.js");
const { Comment } = require("../models/Comments.js");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { error } = validateCreatePost(req.body);
  if (error) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: error.details[0].message });
  }

  const imagePath = req.file.path;
  let result;
  try {
    result = await uploadToCloudinary(imagePath);
  } catch (uploadError) {
    fs.unlinkSync(imagePath);
    return res.status(500).json({ message: "Image upload failed" });
  }

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  await post.save();

  fs.unlinkSync(imagePath);

  res.status(201).json(post);
});

// @desc   Get All Posts (with pagination or category filter)
// @route  GET /api/posts
// @access Public
const getAllPosts = asyncHandler(async (req, res) => {
  const POSTS_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePhoto");
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePhoto");
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email profilePhoto");
  }
  res.json(posts);
});

// @desc   Get Single Post
// @route  GET /api/posts/:id
// @access Public
const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "username email profilePhoto")
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// @desc   Get Posts Count
// @route  GET /api/posts/count
// @access Public
const getPostsCount = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});

// @desc Delete Post
// @route DELETE /api/posts/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await deleteFromCloudinary(post.image.publicId);
    await Comment.deleteMany({ postId: post._id });
    res.json({ message: "Post deleted successfully", postId: post._id });
  } else {
    res
      .status(403)
      .json({ message: "You are not authorized to delete this post" });
  }
});

// @desc  Update Post
// @route PUT /api/posts/:id
// @access Private
const updatePost = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this post" });
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", "username email profilePhoto");
  res.status(200).json(updatedPost);
});

// @desc Toggle Like
// @route PUT /api/posts/like/:id
// @access Private
const toggleLike = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const isLiked = post.likes.find((like) => like.toString() === req.user.id);
  if (isLiked) {
    post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }
  await post.save();
  res.status(200).json(post);
});

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostsCount,
  deletePost,
  updatePost,
  toggleLike,
};
