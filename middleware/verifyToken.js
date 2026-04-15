const jwt = require("jsonwebtoken");

// verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      // user { id, isAdmin }
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token is not valid" });
    }
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

// verify token and admin middleware

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized" });
    }
  });
};

// verify token and admin middleware

const verifyTokenAndOnlyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized" });
    }
  });
};

// verify token and authorization middleware

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
