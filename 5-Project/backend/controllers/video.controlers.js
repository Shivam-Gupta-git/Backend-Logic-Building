import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { Video } from "../model/video.model.js";
import cloudinary from "cloudinary";

export const uploadVideos = async (req, res) => {
  try {
    const { title, description } = req.body;

    if ([title, description].some((fields) => fields?.trim() === "")) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    const videosLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videosLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "video file is required" });
    }

    if (!thumbnailLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "thumbnail file is required" });
    }

    const videoFile = await uploadOnCloudinary(videosLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
      return res.status(500).json({
        success: false,
        message: "video or thumbnail can't upload on cloudinary",
      });
    }

    const videoFileDetails = new Video({
      title,
      description,
      videoFile: videoFile.secure_url,
      thumbnail: thumbnail.secure_url,
      owner: req.registeredUser?._id, // Add owner if you have user authentication
      // Make newly uploaded videos visible on Home by default
      isPublished: true,
    });

    await videoFileDetails.save();

    return res.status(201).json({
      success: true,
      message: "video uploaded successfully",
      data: videoFileDetails,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res
      .status(500)
      .json({ success: false, message: "error while uploading videos" });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    return res.status(200).json({ success: true, data: videos });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error Fetching videos" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log("Fetching video with ID:", videoId); // Debug log

    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is required" });
    }

    // Validate MongoDB ObjectId format
    if (!videoId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid video ID format" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    console.log("Video found:", video.title); // Debug log
    return res.status(200).json({
      success: true,
      data: video.videoFile,
      message: "Video fetched successfully",
    });
  } catch (error) {
    console.error("Error in getVideoById:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while fetching video" });
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { videoId } = req.params;

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "videoId is required" });
    }

    if ([title, description].some((field) => !field || field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "title and description are required",
      });
    }

    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
      return res
        .status(401)
        .json({ success: false, message: "Video id can't be exist" });
    }

    let videoFile, thumbnail;
    if (videoLocalPath) videoFile = await uploadOnCloudinary(videoLocalPath);
    if (thumbnailLocalPath)
      thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const updateData = {
      title,
      description,
    };

    if (videoFile?.url) updateData.videoFile = videoFile.url;
    if (thumbnail?.url) updateData.thumbnail = thumbnail.url;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedVideo) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    try {
      if (videoFile?.url && existingVideo.videoFile) {
        const publishedVideoId = existingVideo.videoFile
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publishedVideoId, {
          resource_type: "videoFile",
        });
      }

      if (thumbnail?.url && existingVideo.thumbnail) {
        const publishedThumbnail = existingVideo.thumbnail
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publishedThumbnail, {
          resource_type: "thumbnail",
        });
      }
    } catch (error) {
      console.warn("No previous avatar to delete or deletion failed:", error);
    }

    return res.status(200).json({
      success: true,
      data: updatedVideo,
      message: "Video details updated successfully",
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error while updating video" });
  }
};

export const deleteVideos = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is required" });
    }

    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
      return res
        .status(400)
        .json({ success: false, message: "video not found" });
    }

    try {
      if (existingVideo.videoFile) {
        const publishedVideoId = existingVideo.videoFile
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publishedVideoId, {
          resource_type: "videoFile",
        });
      }

      if (existingVideo.thumbnail) {
        const publishedThumbnail = existingVideo.thumbnail
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publishedThumbnail, {
          resource_type: "thumbnail",
        });
      }
    } catch (error) {
      console.warn("Error deleting from cloudinary:", error);
      // Continue with deletion even if cloudinary cleanup fails
    }

    await Video.findByIdAndDelete(videoId);
    return res
      .status(200)
      .json({ success: true, message: "video deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error while deleting video" });
  }
};

export const togglePublishedStatus = async (req, res) => {
  try {
    const { isPublished } = req.body;
    // Accept proper boolean values from frontend
    if (typeof isPublished !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublished field must be a boolean",
      });
    }

    const { videoId } = req.params;
    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is required" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { isPublished },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(400).json({
        success: false,
        message: "Video not found or could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Published status updated successfully",
      data: updatedVideo,
    });
  } catch (error) {
    console.error("Error toggling published status:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating published status",
    });
  }
};
