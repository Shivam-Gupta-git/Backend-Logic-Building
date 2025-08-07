import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const userRegistration = [ 
 check('firstName')
 .trim()
 .isLength({min: 2})
 .withMessage('First Name should be Contain at least two character long')
 .matches(/^[A-Za-z\s]*$/)
 .withMessage('First Name should be Contain only alphabets'),

 check('lastName')
 .trim()
 .matches(/^[A-Za-z\s]*$/)
 .withMessage('Last Name should be Contain only alphabets'),

 check('email')
 .trim()
 .isEmail()
 .withMessage('Please Enter a valid Email')
 .normalizeEmail(),

 check('password')
 .trim()
 .isLength({min: 5})
 .withMessage('Password should Contain at least Five character long'),

  async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({success: false, errors: errors.array()})
    }
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({success: false, message: 'User allready exist'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    const savedUser = await newUser.save()
    const token = createToken(savedUser._id)

    res.status(201).json({success: true, token})
  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: error.message})
  }
}]

export const userLogin = async (req, res) => {
  try {
    const {email, password} = req.body
    const registeredUser = await User.findOne({ email });

    if(!registeredUser){
      res.status(400).json({success: false, message: "User can't be exist"})
    }

    const isMatch =  bcrypt.compare(password, registeredUser.password)
    if(isMatch){
     const token = createToken(registeredUser._id)
     res.status(200).json({success: true, token})
    }
    else{
      res.status(400).json({success: false, message: 'Invalid credentials'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message: error.message})
  }
}