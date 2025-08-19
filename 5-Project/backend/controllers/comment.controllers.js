import mongoose from "mongoose";
import { Comment } from "../model/comment.model.js";
import { Video } from "../model/video.model.js";

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!content?.trim()) {
      res
        .status(400)
        .json({ success: false, message: "Comment field is required" });
    }

    if (!videoId?.trim()) {
      res.status(400).json({ success: false, message: "video id is required" });
    }

    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
      res.status(400).json({ success: false, message: "video not found" });
    }

    const commentLocalPath = await Comment.create({
      content,
      video: videoId,
      owner: req.registeredUser._id,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Comment added successfully",
        data: commentLocalPath,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while in add Comment" });
  }
};

export const getComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "video Id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid video ID format" });
    }

    const aggregationPipeline = [
      {
        $match: { video: new mongoose.Types.ObjectId(videoId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          "owner._id": 1,
          "owner.userName": 1,
          "owner.avatar": 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const comments = await Comment.aggregatePaginate(
      Comment.aggregate(aggregationPipeline),
      options
    );

    res.status(200).json({ success: true, ...comments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while in aggregationPipeline",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content?.trim()) {
      res.status(400).json({ success: false, message: "Content is required" });
    }

    if (!commentId?.trim()) {
      res
        .status(400)
        .json({ success: false, message: "commend Id is required" });
    }

    const existingCommentId = await Comment.findById(commentId)
    if(!existingCommentId){
      res.status(400).json({success: false, message: "comment Id not found"})
    }

    const updateComment = await Comment.findByIdAndUpdate(existingCommentId, {
      content,
    });

    if (!updateComment) {
      res
        .status(400)
        .json({ success: false, message: "comment do not update" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "comment update successfully",
        data: updateComment,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error while in updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if(!commentId?.trim()){
      res.status(400).json({success: false, message: "comment Id is required"})
    }
  
    const existingCommentId = await Comment.findById(commentId)
    if(!existingCommentId){
      res.status(400).json({success: false, message: "Comment Id can't be exist"})
    }
  
    await Comment.findByIdAndDelete(existingCommentId)
    res.status(200).json({success: true, message: "Comment deleting successfully"})
  } catch (error) {
    res.status(500).json({success: false, message: "Error while in deleting Comment"})
  }
};

