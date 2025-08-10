import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'
import { uploadOnCloudinary } from '../config/cloudinary.config.js'


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const userRegistration = async (req, res) => {
  try {
    const {userName, fullName, email, password, } = req.body

    if(
      [userName, fullName, email, password].some((fields) => fields?.trim() === "")
    ){
      return res.status(400).json({success: false, message: 'All fields are required'})
    }

    const existingUser = await User.findOne({ 
      $or: [{ userName }, { email }]
     })
    if(existingUser){
      return res.status(400).json({success: false, message: 'User allready exist'})
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.avatar[0]?.path

    if(!avatarLocalPath){
      return res.status(400).json({success: false, message: 'Avatar file is required'})
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
      return res.status(400).json({success: false, message: " can't upload Avatar file on cloudinary"})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
     userName: userName.toLowerCase(), 
     fullName,
     email,
     password: hashedPassword,
     avatar: avatar.url,
     coverImage: coverImage?.url || ""
    })

    const savedUser = newUser.save()
    const token = createToken(savedUser._id)

    res.status(500).json({success: true, token})
  } catch (error) {
    console.log(error)
    res.status(400),json({success: false, message: error.message})
  }

}

export const userLogin = async (req, res) => {
  try {
    const {email, password} = req.body
    const registeredUser = await User.findOne({ email })
    if(!registeredUser){
      res.status(400).json({success: false, message: "User can't be exist"})
    }

    const isMatch = bcrypt.compare(password, registeredUser.password)

    if(isMatch){
      const token = createToken(registeredUser._id)
      res.status(200).json({success: true, token})
    }else{
      res.status(400).json({success: false, message: 'Invaled credentials'})
    }
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}