const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUser, validateLogin } = require("../models/User");
const { Verification } = require("../models/Verificatin");
const crypto = require("crypto");
const sendemail = require("../utils/sendEmail");

const apiUrl = process.env.API_URL || "http://localhost:5000";

// * @desc    Register New User
// * @route   POST /api/auth/register
// * @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  const verificationToken = new Verification({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();

  const link = `https://blogappcl.netlify.app/api/auth/${user._id}/verify/${verificationToken.token}`;
  const htmlTemplate = `
    <div>
      <p>click on the link below to verify your email</p>
      <a href="${link}">Verify</a>
    </div>
  `;

  
    await sendemail(user.email, "Verify your email", htmlTemplate);
     res.status(200).json({
      message:
        "Email send successfully. Please verify your email.",
    });
  }

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isAccountVerified: user.isAccountVerified,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    message: "We sent you an email, please verify your email address",
  });
});

//  @desc    Login User
//  @route   POST /api/auth/login
//  @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!user.isAccountVerified) {
    return res.status(400).json({
      message:
        "Your account is not verified. Please check your email for verification link.",
    });
  }

  const token = user.generateToken();
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isAccountVerified: user.isAccountVerified,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    token: token,
    message: "User logged in successfully",
  });
});

// @desc verify email
// @route /api/auth/:userId/verify/:token GET
// @access public
const verifyUserAccount = asyncHandler(async (req, res) => {
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

  user.isAccountVerified = true;
  await user.save();
  await Verification.deleteOne({ _id: verificationToken._id });

  res.status(200).json({ message: "Your account verified successfully" });
});

module.exports = { registerUser, loginUser, verifyUserAccount };
