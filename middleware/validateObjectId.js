const mongoose = require("mongoose");

// middleware to validate object id

const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid object ID" });
  }
  next();
};

module.exports = validateObjectId;
