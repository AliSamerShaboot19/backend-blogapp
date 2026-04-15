const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comments");

// @desc Create New Comment
// @method Post /api/comments
// @access private

const createComment = asyncHandler(async (req, res) => {
  // 1- validate the request body
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    postId: req.body.postId,
    user: req.user.id,
    text: req.body.text,
    username: profile.username,
  });
  res.status(201).json(comment);
});

// @desc get all comments for a post
// @method Get /api/comments
// @access private (only admin can access this route)
const getCommentsForPost = asyncHandler(async (req, res) => {
  const { postId } = req.query;
  if (!postId) {
    return res.status(400).json({ message: "postId is required" });
  }
  const comments = await Comment.find({ postId }).populate(
    "user",
    "username profilePhoto"
  );
  res.status(200).json(comments);
});

// @delete comment
// @method delete /api/comments/:id
// @access private (only admin can access this route or the user who created the comment)

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (req.user.isAdmin || comment.user.toString() === req.user.id) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  }
  return res.status(403).json({ message: "Access denied" });
});

// @desc update comment
// @method put /api/comments/:id
// @access private (only admin can access this route or the user who created the comment)

const updateComment = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }
  comment.text = req.body.text;
  await comment.save();
  return res.status(200).json(comment);
});

// @desc Get all comments (admin only)
// @route GET /api/comments/all
// @access private (admin)
const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate("user", "username profilePhoto")
    .populate("postId", "title");
  res.status(200).json(comments);
});

module.exports = {
  createComment,
  getCommentsForPost,
  deleteComment,
  updateComment,
  getAllComments,
};
