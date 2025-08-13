import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      require: true
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
}, {timestamps: true})

export const Playlist = mongoose.model('Playlist', playlistSchema)