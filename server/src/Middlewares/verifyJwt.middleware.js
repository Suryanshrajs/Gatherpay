import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -requestSent -requestReceived");

    if (!user) {
      return res.status(401).json({ message: "Authentication failed: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyJwt;
