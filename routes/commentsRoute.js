const router = require("express").Router();
const {
  createComment,
  getCommentsForPost,
  deleteComment,
  updateComment,
  getAllComments,
} = require("../controllers/commentsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");
// api/comments
router
  .post("/", verifyToken, createComment)
  .get("/", verifyToken, getCommentsForPost);

// api/comments/:id
router
  .delete("/:id", verifyToken, validateObjectId, deleteComment)
  .put("/:id", verifyToken, validateObjectId, updateComment);

router.get("/all", verifyToken, verifyTokenAndAdmin, getAllComments);

module.exports = router;
