import express from 'express'
import { createTweet, getUserTweet, updateTweet } from '../controllers/tweet.controllers.js'
import { userAuth } from '../middleware/auth.middleware.js'

const tweetRouter = express.Router()

tweetRouter.post('/createTweet',userAuth, createTweet)
tweetRouter.get('/getUsertweet/:owner', userAuth, getUserTweet)
tweetRouter.patch('/updateTweet/:tweetId', userAuth, updateTweet)

export { tweetRouter }