// import { User } from "../model/user.model"

import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { Video } from "../model/video.model.js";


export const uploadVideos = async (req, res) => {
  try {
    const { title, description } = req.body;
  
    if(
      [title, description].some(
        (fields) => fields?.trim() === ""
      )
    ){
     return res.status(400).json({success: false, message: "all fields are required"})
    }

    const videosLocalPath = req.files?.videoFile[0]?.path;
    let thumbnailLocalPath;
    if(
      req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0
    ){
      thumbnailLocalPath = req.files.thumbnail[0]?.path;
    }

    if(!videosLocalPath){
      res.status(400).json({success: false, message: "video file is required"})
    }
    const videoFile = await uploadOnCloudinary(videosLocalPath)
    const thumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : null;

    if(!videoFile){
      res.status(500).json({success: false, message: "video can't upload on cloudinary"})
    }
    const videoFileDetails = new Video({
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail?.url || ""
    })
    await videoFileDetails.save()

    res.status(500).json({success: true, message: "video will be successfully stored"})
    
  } catch (error) {
    res.status(401).json({success: false, message: 'error while in uploaded videos'})
  }

}
