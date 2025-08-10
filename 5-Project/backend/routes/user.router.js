import express from 'express'
import { userLogin, userRegistration } from '../controllers/user.controllers.js'
import { upload } from '../middleware/multer.middleware.js'

const userRouter = express.Router()

userRouter.post('/register',upload.fields([
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'coverImage',
    maxCount: 1
  }
]), userRegistration)
userRouter.post('/login', userLogin)

export { userRouter }