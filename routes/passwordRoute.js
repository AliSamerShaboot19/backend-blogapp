const {
  sendResetpasswordLink,
  getResetPasswordLink,
  resetPassword,
} = require("../controllers/Password");

const router = require("express").Router();
router.post("/reset-password-link", sendResetpasswordLink);
router
  .get("/reset-password/:userId/:token", getResetPasswordLink)
  .post("/reset-password/:userId/:token", resetPassword);
module.exports = router;
