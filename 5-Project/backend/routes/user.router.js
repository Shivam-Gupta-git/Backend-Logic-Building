import express from 'express'
import { userLogin, userLogout, userRegistration } from '../controllers/user.controllers.js'
import { upload } from '../middleware/multer.middleware.js'
import { userAuth } from '../middleware/auth.middleware.js'

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
userRouter.post('/logout',userAuth, userLogout)

export { userRouter }