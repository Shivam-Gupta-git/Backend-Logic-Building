import mongoose from "mongoose";
import { Tweet } from "../model/tweet.model.js";
import { User } from "../model/user.model.js";

export const createTweet = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const tweetFile = new Tweet({
      content: content.trim(),
      owner: req.registeredUser._id,
    });

    const savedTweet = await tweetFile.save();

    return res.status(201).json({
      success: true,
      message: "Tweet created successfully",
      data: savedTweet,
    });
  } catch (error) {
    console.error("Error creating tweet:", error);
  }
};

export const getUserTweet = async (req, res) => {
  try {
    const { owner } = req.params;

    if(!owner?.trim()){
      return res.status(400).json({success: false, message: "Owner id is required"})
    }

    const existingUser = await User.findById(owner)
    if(!existingUser){
      return res.status(400).json({success: false, message: "Invaled owner Id"})
    }
    
    const tweets = await Tweet.find({ owner })

    if(!tweets.length){
      return res.status(400).json({success: false, message: "No tweets found for user"})
    }

    return res.status(200).json({success: true, message: "tweet fetching successfully", data: tweets})
  } catch (error) {
    return res.status(500).json({success: false, message: "while Error in get user tweets"})
  }
};

export const updateTweet = async (req, res) => {
try {
    const { tweetId } = req.params;
    const { content } = req.body;
  
    if(!tweetId?.trim()){
      return res.status(400).json({success: false, message: "Tweet Id is required"})
    }
  
    if(!content?.trim()){
      return res.status(400).json({success: false, message: "content is required"})
    }
  
    const existingTweetId = await Tweet.findById(tweetId);
    if(!existingTweetId){
      return res.status(400).json({success: false, message: "Tweed id not found"})
    }
  
    const updateTweet = await Tweet.findByIdAndUpdate(existingTweetId, {
      content,
    })
    if(!updateTweet){
      return res.status(400).json({success: false, message: "Tweed not updated"})
    }
  
    return res.status(200).json({success: true, message: "Tweed is updated", data: updateTweet})
} catch (error) {
  return res.status(500).json({success: false, message: "while error in updated tweet"})
}
};

export const deleteTweet = async (req, res) => {
  try {
    const { tweetId } = req.params
    if(!tweetId?.trim()){
      return res.status(400).json({success: false, message: "tweet Id is required"})
    }
  
    const existingTweetId = await Tweet.findById(tweetId);
    if(!existingTweetId){
      return res.status(400).json({success: false, message: "tweet Id can't be exist"})
    }
  
    await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json({success: true, message: "tweet deleting succesfully"})
  } catch (error) {
    return res.status(500).json({success: false, message: "Error while in delete tweet"})
  }

}




