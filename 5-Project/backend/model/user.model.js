import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }
  ],
  refreshToken:{
    type: String 
  }
}, 
{timestamps: true}
)

export const User = mongoose.model('User', userSchema)