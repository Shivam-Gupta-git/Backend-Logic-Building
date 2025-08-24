import mongoose from "mongoose";
import { Video } from "../model/video.model.js";
import { Like } from "../model/like.model.js"

export const getChannelState = async (req, res) => {
  try {
    const UserId = req.registeredUser._id;

    const totalVideos = await Video.countDocuments({ owner: UserId })
    const videoViews = await Video.aggregate([
      {
        $match: {owner: new mongoose.Types.ObjectId(UserId)}
      },
      {
        $group: {_id: null, totalViews: {$sum: "$views"}}
      }
    ])
    const totalViews = videoViews[0]?.totalViews || 0;

    const totalVideoId = await Video.find({ owner: UserId}).select("_id")
    const videoIdArray = totalVideoId.map(video => video._id);

    const totalLikes = await Like.countDocuments({
      video: {$in  : videoIdArray}
    })

    res.status(200).json({success: true, data:
       totalVideos, 
       totalViews, 
       totalLikes,})
  } catch (error) {
    console.error("Error while in getChannelState", error)
    res.status(500).json({success: false, message: error.message})
  }
}

export const getChannelVideos = async (req, res) => {
 try {
  const UserId = req.registeredUser._id;
  const getallVideos = await Video.find({ owner: UserId}).sort({ createdAt: -1}).populate("owner").lean()

  if(!getallVideos || getallVideos.length === 0){
    res.status(400).json({success: false, message: "Video not found"})
  }

  res.status(200).json({success: true, data: getallVideos, totalVideo: getallVideos.length})

 } catch (error) {
  console.error("Error while in getChannelVideos", error)
  res.status(500).json({success: false, message: error.message})
 }
}