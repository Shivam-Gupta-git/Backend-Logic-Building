import express from 'express'
import { createTweet, deleteTweet, getUserTweet, updateTweet } from '../controllers/tweet.controllers.js'
import { userAuth } from '../middleware/auth.middleware.js'

const tweetRouter = express.Router()

tweetRouter.post('/createTweet',userAuth, createTweet)
tweetRouter.get('/getUsertweet/:owner', userAuth, getUserTweet)
tweetRouter.patch('/updateTweet/:tweetId', userAuth, updateTweet)
tweetRouter.delete('/deleteTweet/:tweetId', deleteTweet)

export { tweetRouter }