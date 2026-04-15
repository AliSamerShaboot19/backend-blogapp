const router = require("express").Router();
const photoUpload = require("../middleware/photoUpload.js");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostsCount,
  deletePost,
  updatePost,
  toggleLike,
} = require("../controllers/postsController.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const validateObjectId = require("../middleware/validateObjectId.js");

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router
  .post("/", verifyToken, photoUpload.single("image"), createPost)
  .get("/", getAllPosts);

// @desc    Get POSTS count
// @route   GET /api/posts/count
// @access  Public
router.get("/count", getPostsCount);

// @route   GET /api/posts/:id
// @desc    Get a post by id
// @access  Public
router
  .get("/:id", validateObjectId, getSinglePost)
  .delete("/:id", verifyToken, validateObjectId, deletePost)
  .put("/:id", verifyToken, validateObjectId, updatePost);

// @route   POST /api/posts/like/:id
// @desc    Toggle like/unlike a post
// @access  Private
router.put("/like/:id", verifyToken, validateObjectId, toggleLike);

module.exports = router;
