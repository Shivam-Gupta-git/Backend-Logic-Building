import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const registeredUser = await User.findById(userId)
    const accessToken = registeredUser.generateAccessToken()
    const refereshToken = registeredUser.generateRefreshToken()

    registeredUser.refereshToken = refereshToken
    await registeredUser.save({ validateBeforeSave: false })

    return { accessToken, refereshToken }

  } catch (error) {
    console.log("Error while in access and referesh token", error)
  }
}

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
      return res
        .status(400)
        .json({
          success: false,
          message: "can't upload Avatar file on cloudinary",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      fullName,
      email,
      password: hashedPassword,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const savedUser = newUser.save();
    const token = createToken(savedUser._id);

    res.status(500).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!password || !(email || userName)) {
      return res.status(400).json({ success: false, message: "Email/username and password are required" });
    }

    const registeredUser = await User.findOne({ 
      $or: [{ email }, { userName }]
    });
    if (!registeredUser) { 
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, registeredUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refereshToken } = await generateAccessAndRefereshTokens(registeredUser._id);

    const loggedInUser = await User.findById(registeredUser._id).select("-password -refereshToken");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV ,
      sameSite: "none"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refereshToken, options)
      .json({
        success: true,
        user: loggedInUser
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Maybe Deleted
export const userLogout = async (req, res) => {
  User.findByIdAndUpdate(
    req.registeredUser._id,
    {
      $set: {
        refreshToken: undefined
      },
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).json({success: true,  message: 'User logged uot succeddfully'})

}
