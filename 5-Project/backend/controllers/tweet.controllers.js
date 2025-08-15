import { Tweet } from "../model/tweet.model.js";

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
