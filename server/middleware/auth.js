import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).json({ msg: "Access Denied: No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    } else {
      return res.status(400).json({ msg: "Invalid token format" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).populate("restaurant");
    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Invalid or expired token", error: error.message });
  }
};
