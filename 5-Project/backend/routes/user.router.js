import express from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  refereshAccessToken,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvtar,
  userLogin,
  userLogout,
  userRegistration,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { userAuth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegistration
);

userRouter.post("/login", userLogin);
userRouter.post("/logout", userAuth, userLogout);
userRouter.post("/refreshAccessToken", refereshAccessToken);
userRouter.post("/changePassword", userAuth, changeCurrentPassword);
userRouter.get("/currentUser", userAuth, getCurrentUser);
userRouter.patch("/updateAccount", userAuth, updateAccountDetails);
userRouter.patch("/avatar", userAuth, upload.single("avatar"), updateUserAvtar);
userRouter.patch("/coverImage", userAuth,upload.single("coverImage"),updateCoverImage);
userRouter.get("/c/:userName", userAuth, getUserChannelProfile);
userRouter.get("/history", userAuth, getWatchHistory);

export { userRouter };
