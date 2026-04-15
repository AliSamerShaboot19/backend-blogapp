const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/categoryController");
const validateObjectId = require("../middleware/validateObjectId");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = require("express").Router();

// api/categories
router
  .post("/", verifyTokenAndAdmin, createCategory)
  .get("/", getAllCategories);

// api/categories/:id
router.delete("/:id", verifyTokenAndAdmin, validateObjectId, deleteCategory);

module.exports = router;
