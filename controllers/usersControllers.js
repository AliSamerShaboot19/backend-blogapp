const asyncHandler = require("express-async-handler");
const { User, validateUpdate } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} = require("../utils/cloudinary.js");
const { Comment } = require("../models/Comments.js");
const { Post } = require("../models/Post.js");

// @desc    Get all users
// @route   GET /api/users/profile
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Private (only user himself)
const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Get users count
// @route   GET /api/users/count
// @access  Private/Admin
const getUsersCount = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json({ count });
});

// @desc    Upload profile picture
// @route   POST /api/users/profile/profile-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const imagePath = req.file.path;
  let result;
  try {
    result = await uploadToCloudinary(imagePath);
  } catch (uploadError) {
    fs.unlinkSync(imagePath);
    return res.status(500).json({ message: "Image upload failed" });
  }

  const user = await User.findById(req.user.id);
  if (user.profilePhoto.publicId) {
    await deleteFromCloudinary(user.profilePhoto.publicId);
  }

  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  fs.unlinkSync(imagePath);

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    profilePhoto: user.profilePhoto,
  });
});

// @desc    Delete user profile (account)
// @route   DELETE /api/users/profile/:id
// @access  Private (user himself or admin)
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const posts = await Post.find({ user: req.params.id });
  const publicIds = posts.map((post) => post.image.publicId).filter(Boolean);
  if (publicIds.length > 0) {
    await deleteMultipleFromCloudinary(publicIds);
  }

  if (user.profilePhoto.publicId) {
    await deleteFromCloudinary(user.profilePhoto.publicId);
  }

  await Post.deleteMany({ user: req.params.id });
  await Comment.deleteMany({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "User profile deleted successfully" });
});

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
  uploadProfilePicture,
  deleteUserProfile,
};
