import mongoose, { Schema } from 'mongoose'


const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
}, {timestamps: true})


export const Tweet = mongoose.model('Tweet', tweetSchema)

