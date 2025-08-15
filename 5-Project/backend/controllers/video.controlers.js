import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { Video } from "../model/video.model.js";
import cloudinary from 'cloudinary'

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
    const { videoId } = req.params;

    // Correct multer field names
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoId?.trim()) {
      return res.status(400).json({ success: false, message: "videoId is required" });
    }

    if ([title, description].some(field => !field || field.trim() === "")) {
      return res.status(400).json({ success: false, message: "title and description are required" });
    }

    const existingVideo = await Video.findById(videoId)
    if(!existingVideo){
      return res.status(401).json({success: false, message: "Video id can't be exist"})
    }

    let videoFile, thumbnail;
    if (videoLocalPath) videoFile = await uploadOnCloudinary(videoLocalPath);
    if (thumbnailLocalPath) thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const updateData = {
      title,
      description
    };

    if (videoFile?.url) updateData.videoFile = videoFile.url;
    if (thumbnail?.url) updateData.thumbnail = thumbnail.url;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    try {
      if(videoFile?.url && existingVideo.videoFile){
       const publishedVideoId = existingVideo.videoFile.split('/').pop().split('.')[0]
       await cloudinary.uploader.destroy(publishedVideoId, {resource_type: "videoFile"})
      }

      if(thumbnail?.url && existingVideo.thumbnail){
        const publishedThumbnail = existingVideo.thumbnail.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publishedThumbnail, {resource_type: "thumbnail"})
      }
    } catch (error) {
      console.warn("No previous avatar to delete or deletion failed:", error);
    }

    return res.status(200).json({
      success: true,
      data: updatedVideo,
      message: "Video details updated successfully"
    });

  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({ success: false, message: "Error while updating video" });
  }
};

export const deleteVideos = async (req, res) => {
  const { videoId } = req.params;
  console.log(videoId)
}
