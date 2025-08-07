import express from 'express'
import { userLogin, userRegistration } from '../controllers/user.controllers.js'

const userRouter = express.Router()

userRouter.post('/register', userRegistration)
userRouter.post('/login', userLogin)

export { userRouter };