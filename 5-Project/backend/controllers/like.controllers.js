import { Like } from "../model/like.model.js";
import { Video } from "../model/video.model.js";

export const toggleVideoLike = async (req, res) =>{
try {
    const { videoId } = req.params;
    if(!videoId?.trim()){
      return res.status(400).json({success: false, message: "video Id is required"})
    }
  
    const existingVideoId = await Video.findById(videoId)
    if(!existingVideoId){
      return res.status(400).json({success: false, message: 'video Id is not found'})
    }
  
    const toggleVideoLike = await Like.findOne({
      video: videoId,
      likeBy: req.registeredUser._id
    })
    
    if(toggleVideoLike){
      await Like.findByIdAndDelete(toggleVideoLike._id)
      return res.status(400).json({success: false, message: "Video unliked successfully", liked: false})
    }else{
      await Like.create({
        video: videoId,
        likeBy: req.registeredUser._id
      })
      return res.status(200).json({success: true, message: "Video liked successfully", liked: true})
    }
} catch (error) {
  console.error('While Error in toggleVideoLike', error)
  return res.status(500).json({success: false, message: error.message})
}
}