const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordCompexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn-icons-png.flaticon.com/512/3781/3781986.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual populate posts

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
});

// Generate token

UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};

// Validation functions

function validateUser(user) {
  const schema = joi.object({
    username: joi.string().min(3).max(100).required(),
    email: joi.string().min(5).max(100).required().email(),
    password: passwordCompexity().required(),
  });
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = joi.object({
    email: joi.string().min(5).max(100).required().email(),
    password: joi.string().min(6).max(100).required(),
  });
  return schema.validate(user);
}

function validateUpdate(user) {
  const schema = joi.object({
    username: joi.string().min(3).max(100),
    email: joi.string().min(5).max(100).email(),
    password: passwordCompexity(),
    bio: joi.string().max(500),
  });
  return schema.validate(user);
}

// validate Email

function validateEmail(user) {
  const schema = joi.object({
    email: joi.string().min(5).max(100).email().required(),
  });
  return schema.validate(user);
}

// validate new password

function validateNewPassword(user) {
  const schema = joi.object({
    password: joi.string().min(6).required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validateUser,
  validateLogin,
  validateUpdate,
  validateEmail,
  validateNewPassword,
};
