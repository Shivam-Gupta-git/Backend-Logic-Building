import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: [true, 'UserName should be required'],
    unique: true,
    tolowerCase: true
  },
  email: {
   type: String,
   require: [true, 'Email should be required'],
   unique: true,
   tolowerCase: true
  },
  password: {
    type: String,
    require: [true, 'Password should be required'],
    unique: true,
  },
  fullName: {
    type: String,
    require: [true, 'FullName should be required']
  }, 
  avatar: {
    type: String,
    require: true
  },
  coverImage: {
    type: String
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }
  ],
  refreshToken:{
    type: String 
  }
}, 
{timestamps: true}
)

userSchema.pre("save", async function (next) {
if(!this.isModified('password')) return next()

this.password = await bcrypt.hash(this.password, 12);
next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName
    },
    process.env.JWT_SECRET, {expiresIn: '1d'}
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET, {expiresIn: '10d'}
  )
}

export const User = mongoose.model('User', userSchema)