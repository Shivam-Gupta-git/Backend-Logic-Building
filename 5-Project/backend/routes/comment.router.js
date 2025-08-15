import express from 'express'
import { userAuth } from '../middleware/auth.middleware.js'
import { addComment, getComment } from '../controllers/comment.controllers.js'

const commentRouter = express.Router()

commentRouter.post('/addComment/:videoId',userAuth, addComment)
commentRouter.get('/getComment/:videoId',userAuth, getComment)

export { commentRouter }