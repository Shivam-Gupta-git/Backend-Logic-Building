import { Comment } from "../model/comment.model.js";
import { Like } from "../model/like.model.js";
import { Tweet } from "../model/tweet.model.js";
import { Video } from "../model/video.model.js";

export const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is required" });
    }

    const existingVideoId = await Video.findById(videoId);
    if (!existingVideoId) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is not found" });
    }

    const toggleVideoLike = await Like.findOne({
      video: videoId,
      likeBy: req.registeredUser._id,
    });

    if (toggleVideoLike) {
      await Like.findByIdAndDelete(toggleVideoLike._id);
      return res
        .status(200)
        .json({
          success: true,
          message: "Video unliked successfully",
          liked: false,
        });
    } else {
      await Like.create({
        video: videoId,
        likeBy: req.registeredUser._id,
      });
      return res
        .status(200)
        .json({
          success: true,
          message: "Video liked successfully",
          liked: true,
        });
    }
  } catch (error) {
    console.error("While Error in toggleVideoLike", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "comment Id is required" });
    }

    const existingCommentId = await Comment.findById(commentId);
    if (!existingCommentId) {
      return res
        .status(400)
        .json({ success: false, message: "Comment Id is not found" });
    }

    const toggleCommentLike = await Like.findOne({
      comment: commentId,
      likeBy: req.registeredUser._id,
    });
    if (toggleCommentLike) {
      await Like.findByIdAndDelete(toggleCommentLike._id);
      return res
        .status(200)
        .json({
          success: true,
          message: "comment unlike successfully",
          liked: false,
        });
    } else {
      await Like.create({
        comment: commentId,
        likeBy: req.registeredUser._id,
      });
      return res
        .status(200)
        .json({
          success: true,
          message: "comment like successfully",
          liked: true,
        });
    }
  } catch (error) {
    console.error("Error while in toggleCommentLike", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleTweetLike = async (req, res) => {
  try {
    const { tweetId } = req.params;
    if (!tweetId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "tweet Id is required" });
    }

    const existingTweetId = await Tweet.findById(tweetId);
    if (!existingTweetId) {
      return res
        .status(400)
        .json({ success: false, message: "tweet Id is not found" });
    }

    const toggleTweetLike = await Like.findOne({
      tweet: tweetId,
      likeBy: req.registeredUser._id,
    });

    if (toggleTweetLike) {
      await Like.findByIdAndDelete(toggleTweetLike._id);
      return res
        .status(200)
        .json({
          success: true,
          message: "tweet unlike successfully",
          liked: false,
        });
    } else {
      await Like.create({
        tweet: tweetId,
        likeBy: req.registeredUser._id,
      });
      return res
        .status(200)
        .json({
          success: true,
          message: "tweet like successfully",
          liked: true,
        });
    }
  } catch (error) {
    console.error("Error while in toggleTweetLike", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLikedVideos = async (req, res) => {
  try {
    const likedVideos = await Like.find({
      likeBy: req.registeredUser._id,
      video: { $exists: true, $ne: null }, // Only get likes that have a video
    }).populate("video"); // Fixed: lowercase "video" to match the field name

    return res.status(200).json({
      success: true,
      count: likedVideos.length,
      data: likedVideos,
    });
  } catch (error) {
    console.error("Error while in getLikedVideos:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
