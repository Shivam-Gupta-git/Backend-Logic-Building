import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({

  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    require: true
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    require: true
  },

  likeBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
    require: true
  }
  
}, {timestamps: true})

export const Like = mongoose.model('Like', likeSchema)
