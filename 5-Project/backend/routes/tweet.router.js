import express from 'express'
import { createTweet } from '../controllers/tweet.controllers.js'
import { userAuth } from '../middleware/auth.middleware.js'

const tweetRouter = express.Router()

tweetRouter.post('/createTweet',userAuth, createTweet)

export { tweetRouter }