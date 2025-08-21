import express from 'express'
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from '../controllers/like.controllers.js';
import { userAuth } from '../middleware/auth.middleware.js';

const likeRouter = express.Router();
likeRouter.post('/addVideoLike/:videoId',userAuth, toggleVideoLike)
likeRouter.post('/addCommentLike/:commentId', userAuth, toggleCommentLike)
likeRouter.post('/addTweetLike/:tweetId', userAuth, toggleTweetLike)
likeRouter.get('/getLikeVideo', userAuth, getLikedVideos)

export { likeRouter }