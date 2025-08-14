// import { User } from "../model/user.model"

import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { User } from "../model/user.model.js";
import { Video } from "../model/video.model.js";

export const uploadVideos = async (req, res) => {
  try {
    const { title, description } = req.body;

    if ([title, description].some((fields) => fields?.trim() === "")) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    const videosLocalPath = req.files?.videoFile[0]?.path;
    let thumbnailLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalPath = req.files.thumbnail[0]?.path;
    }

    if (!videosLocalPath) {
      res
        .status(400)
        .json({ success: false, message: "video file is required" });
    }
    const videoFile = await uploadOnCloudinary(videosLocalPath);
    const thumbnail = thumbnailLocalPath
      ? await uploadOnCloudinary(thumbnailLocalPath)
      : null;

    if (!videoFile) {
      res
        .status(500)
        .json({ success: false, message: "video can't upload on cloudinary" });
    }
    const videoFileDetails = new Video({
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail?.url || "",
    });
    await videoFileDetails.save();

    res
      .status(500)
      .json({ success: true, message: "video will be successfully stored" });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error while in uploaded videos" });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
    res.status(200).json({success: true, data: videos})
  } catch (error) {
    res.status(500).json({success: false, message: "Error Fetching videos"})
  }
}

export const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    if(!videoId?.trim()){
      res.status(400).json({success: false, message: "video Id is required"})
    }
  
    const video = await Video.findById(videoId)
    if(!video){
      res.status(404).json({success: false, message: "video not found"})
    }
    res.status(200).json({success: true, data: video.videoFile})
  } catch (error) {
    res.status(500).json({success: false, message: "Error while fatching video"})
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoLocalPath = req.file?.video[0]?.path;
    const thumbnailLocalPath = req.file?.thumbnail[0]?.path

    const { videoId } = req.params
    if([title, description, videoLocalPath, thumbnailLocalPath].some((field) => {
      field?.trim() === ""
    })){
      res.status(400).json({success: false, message: "all fields will be required"})
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if([videoFile?.url, thumbnail?.url].some((fieldPath) => {
     fieldPath?.trim() === ""
    })){
     res.status(401).json({success: false, message: "videoFile and thumbnail can't be uploaded on cloudinary"})
    }

    const videoDetails = await Video.findByIdAndUpdate(
      videoId,{
        $set: {
          title,
          description,
          videoFile: videoFile.url,
          thumbnail: thumbnail.url 
        }
      },
      {
        new: true
      }
    )

    res.status(200).json({success: true, data: videoDetails, message: "video details will be updated"})
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating video"
    });
  }
};