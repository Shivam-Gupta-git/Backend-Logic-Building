import express from 'express'
import { deleteVideos, getAllVideos, getVideoById, updateVideoDetails, uploadVideos } from '../controllers/video.controlers.js'
import { userAuth } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const videoRouter = express.Router()

videoRouter.post('/:uploadVideo',userAuth, upload.fields([
  {
    name: "videoFile",
    maxCount: 1
  },
  {
    name: "thumbnail",
    maxCount: 1
  }
]), uploadVideos)
videoRouter.get('/',getAllVideos)
videoRouter.get('/:videoId', userAuth, getVideoById)
videoRouter.put('/updateVideoDetails/:videoId', userAuth, upload.fields([
  {
    name: "videoFile",
    maxCount: 1
  },
  {
    name: "thumbnail",
    maxCount: 1
  }
]), updateVideoDetails)
videoRouter.post('/deleteVideo/:videoId', userAuth, deleteVideos)

export { videoRouter }