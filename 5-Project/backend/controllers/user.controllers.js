import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const userRegistration = async (req, res) => {
  try {
    const {userName, email, password, } = req.body

    const existingUser = await User.findOne({ email })
    if(existingUser){
      return res.status(400).json({success: false, message: 'User allready exist'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
     userName,
     email,
     password: hashedPassword
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