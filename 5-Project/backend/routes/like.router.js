import express from 'express'
import { toggleVideoLike } from '../controllers/like.controllers.js';
import { userAuth } from '../middleware/auth.middleware.js';

const likeRouter = express.Router();
likeRouter.post('/addVideoLike/:videoId',userAuth, toggleVideoLike)

export { likeRouter }