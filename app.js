const express = require("express");
const connectDB = require("./config/connectDB");
const errorHandler = require("./middleware/error");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Connect to the database
connectDB();

const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// init app
const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/password", require("./routes/passwordRoute"));

// Error Handling Middleware (must be after routes)
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

// Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
