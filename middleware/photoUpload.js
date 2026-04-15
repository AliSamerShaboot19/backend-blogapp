const path = require("path");
const multer = require("multer");

// determine the storage location and filename

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error("No file provided"), null);
    }
  },
});

// photo upload middleware

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg, jpg and png files are allowed"), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 10 },
});

module.exports = upload;
