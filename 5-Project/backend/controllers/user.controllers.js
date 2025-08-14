import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cloudinary from 'cloudinary'

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const registeredUser = await User.findById(userId);
    const accessToken = registeredUser.generateAccessToken();
    const refereshToken = registeredUser.generateRefreshToken();

    registeredUser.refereshToken = refereshToken;
    await registeredUser.save({ validateBeforeSave: false });

    return { accessToken, refereshToken };
  } catch (error) {
    console.log("Error while in access and referesh token", error);
  }
};

export const userRegistration = async (req, res) => {
  try {
    const { userName, fullName, email, password } = req.body;

    if (
      [userName, fullName, email, password].some(
        (fields) => fields?.trim() === ""
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User allready exist" });
    }

    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "Avatar file is required" });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "can't upload Avatar file on cloudinary",
      });
    }

    const newUser = new User({
      userName,
      fullName,
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    newUser.save();

    res
      .status(500)
      .json({ success: true, message: "data will be successfully stored" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!password || !(email || userName)) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    const registeredUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    console.log(registeredUser);
    if (!registeredUser) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordValid = await registeredUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refereshToken } =
      await generateAccessAndRefereshTokens(registeredUser._id);

    const loggedInUser = await User.findById(registeredUser._id).select(
      "-password -refereshToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refereshToken", refereshToken, options)
      .json({
        success: true,
        user: loggedInUser, accessToken, refereshToken
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogout = async (req, res) => {
  User.findByIdAndUpdate(req.registeredUser._id, {
    $unset: {
      refereshToken: 1,
    },
    new: true,
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json({ 
      success: true, 
      message: "User logged out succeddfully",
      data: {} 
    });
};

export const refereshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    (await req.cookies.refereshToken) || req.body.refereshToken;
  if (!incomingRefreshToken) {
    res.status(401).json({ success: false, message: "Unauthorized token" });
  }

  try {
    const decoded_Token = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET
    );

    const registeredUser = await User.findById(decoded_Token?._id);
    if (!registeredUser) {
      res
        .status(401)
        .json({ success: false, message: "Invaled refresh token" });
    }

    if (incomingRefreshToken !== registeredUser?.refereshToken) {
      res
        .status(401)
        .json({ success: false, message: "refresh token is expired/used" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(registeredUser._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        ({ accessToken, refereshToken: newRefreshToken },
        "access token refresh successfully")
      );
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "erreo while in refereshAccessToken" });
  }
};

export const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;
  console.log(oldPassword, newPassword, confPassword)
  if (!(newPassword === confPassword)) {
    res.status(401).json({
      status: false,
      message: "NewPassword or confPassword cant't matched",
    });
  }

  const registeredUser = await User.findById(req.registeredUser?._id);

  const isPasswordCorrect = await registeredUser.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    res.status(401).json({ success: false, message: "Invaled old Password" });
  }

  registeredUser.password = newPassword;
  await registeredUser.save();

  return res
    .status(200)
    .json({ success: true, message: "Password change successfully" });
};

export const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json(req.registeredUser, "currrent user fetch successfully");
};

export const updateAccountDetails = async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    res
      .status(400)
      .json({ success: false, message: "All fields will be required" });
  }

  const registeredUser = await User.findByIdAndUpdate(
    req.registeredUser?._id,
    {
      $set: {
        email,
        fullName,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    success: true,
    registeredUser,
    message: "Account details updated",
  });
};

export const updateUserAvtar = async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    res
      .status(401)
      .json({ success: false, message: "Avatar file is required" });
  }

  const currentUser = await User.findById(req.registeredUser?.id)
  if(!currentUser){
    res.status(401).json({success: false, message: "user not found"})
  }

  if(currentUser.avatar){
    try {
      const publicId = currentUser.avatar.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.warn("No previous avatar to delete or deletion failed:", error);
    }
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    res
      .status(401)
      .json({ success: false, message: "avatar file url can't be exist" });
  }
  const registeredUser = await User.findByIdAndUpdate(
    req.registeredUser?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");





  return res.status(200).json({
    success: true,
    registeredUser,
    message: "Avatar file changed successfully",
  });
};

export const updateCoverImage = async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    res
      .status(401)
      .json({ success: false, message: "coverImage can't be exist" });
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    res
      .status(401)
      .json({ success: false, message: "coverImage file url can't be exist" });
  }

  const registeredUser = await User.findByIdAndUpdate(
    req.registeredUser?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    success: true,
    registeredUser,
    message: "coverImage file changed successfully",
  });
};

export const getUserChannelProfile = async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    res.status(400).json({ success: false, message: "userName does't exist" });
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [ new mongoose.Types.ObjectId(req.registeredUser?._id), "$subscribers.subscriber" ] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    res.status(401).json({ success: false, message: "channel doen't exist" });
  }
  console.log("getUserChannelProfile", channel);
  return res.status(200).json(channel[0], {
    success: true,
    message: "user chennel fetch successfully",
  });
};

export const getWatchHistory = async (req, res) => {
  try {
    const registeredUser = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.registeredUser._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      userName: 1,
                      fullName: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: { $first: "$owner" },
              },
            },
          ],
        },
      },
    ]);

    if (!registeredUser.length) {
      return res.status(404).json({
        success: false,
        message: "User does not exist or has no watch history",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Watch history fetched successfully",
      data: registeredUser[0].watchHistory,
    });

  } catch (error) {
    console.error("Error fetching watch history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};