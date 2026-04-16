const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateEmail, validateNewPassword } = require("../models/User");
const { Verification } = require("../models/Verificatin");
const crypto = require("crypto");
const sendemail = require("../utils/sendEmail");

const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";

// send reset password link
const sendResetpasswordLink = asyncHandler(async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "User with given email doesn't exist" });
  }

  let verificationToken = await Verification.findOne({ userId: user._id });
  if (!verificationToken) {
    verificationToken = new Verification({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
  }
  await verificationToken.save();

  const link = `https://frontend-blogapp-cqlb.vercel.app/reset-password/${user._id}/${verificationToken.token}`;
  const htmlTemplate = `<a href="${link}">Click here to reset your password</a>`;

  try {
    await sendemail(user.email, "Reset Password", htmlTemplate);
  } catch (emailError) {
    return res.status(500).json({
      message: "Failed to send reset password email. Please try again later.",
    });
  }

  res.status(200).json({
    message: "Password reset link sent to your email. Please check your inbox.",
  });
});

const getResetPasswordLink = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }
  const verificationToken = await Verification.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid link" });
  }
  res.status(200).json({ message: "Valid URL" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { error } = validateNewPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }

  const verificationToken = await Verification.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid link" });
  }

  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  await user.save();
  await verificationToken.deleteOne();

  res
    .status(200)
    .json({ message: "Password reset successfully, please login" });
});

module.exports = {
  getResetPasswordLink,
  resetPassword,
  sendResetpasswordLink,
};
