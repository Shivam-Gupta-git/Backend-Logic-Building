import { User } from '../model/user.model.js'
import jwt from 'jsonwebtoken' 

export const userAuth = async (req, res, next) => {
  try {
   
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", " ")
  if(!token){
    res.status(401).json({success: false, message: 'Unauthorized request'})
  }

  const decoded_Token = jwt.verify(token, process.env.JWT_SECRET)
  const registeredUser = await User.findById(decoded_Token?._id).select("-password -refereshToken")

  if(!registeredUser){
    res.status(401).json({success: false, message: 'user token not exist'})
  }
  req.registeredUser = registeredUser
  next()
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}