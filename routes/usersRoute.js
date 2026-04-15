const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
  uploadProfilePicture,
  deleteUserProfile,
} = require("../controllers/usersControllers.js");
const upload = require("../middleware/photoUpload.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken.js");

const router = require("express").Router();
// api/users/profile
router.get("/profile", verifyTokenAndAdmin, getAllUsers);
// api/users/profile/:id
router
  .get("/profile/:id", validateObjectId, getUserProfile)
  .put(
    "/profile/:id",
    validateObjectId,
    verifyTokenAndOnlyUser,
    updateUserProfile
  )
  .delete(
    "/profile/:id",
    validateObjectId,
    verifyTokenAndAuthorization,
    deleteUserProfile
  );

// api/users/count
router.get("/count", verifyTokenAndAdmin, getUsersCount);

// api/users/profile-picture
// npm i multer cloudinary
router.post(
  "/profile/profile-picture",
  verifyToken,
  upload.single("image"),
  uploadProfilePicture
);
module.exports = router;

// upload.single("image") => this middleware will handle the file upload and it will look for a file with the name "image" in the request. If the file is uploaded successfully, it will be available in req.file and we can use it in the uploadProfilePicture controller to save the file path to the user's profile in the database.
