import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  try {
    console.log("Auth middleware - checking token...");

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token found:", token ? "Yes" : "No");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request" });
    }

    const decoded_Token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user:", decoded_Token._id);

    const registeredUser = await User.findById(decoded_Token?._id).select(
      "-password -refereshToken"
    );
    console.log("User found:", registeredUser ? "Yes" : "No");

    if (!registeredUser) {
      return res
        .status(401)
        .json({ success: false, message: "User token not exist" });
    }

    req.registeredUser = registeredUser;
    console.log("User set in req.registeredUser:", req.registeredUser.userName);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: error.message });
  }
};
