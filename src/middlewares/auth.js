const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) {
    return res.status(401).json({ message: "No auth token provided" });
  }
  try {
    const decoded = jwt.verify(auth_token, "medixify@2210");
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  userAuth,
};
