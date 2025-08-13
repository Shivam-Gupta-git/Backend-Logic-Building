import express from 'express'
import { uploadVideos } from '../controllers/video.controlers.js'
import { userAuth } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const videoRouter = express.Router()

videoRouter.post('/uploadVideo',userAuth, upload.fields([
  {
    name: "videoFile",
    maxCount: 1
  },
  {
    name: "thumbnail",
    maxCount: 1
  }
]), uploadVideos)

export { videoRouter }