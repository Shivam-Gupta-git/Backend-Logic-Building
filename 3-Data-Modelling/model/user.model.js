import mongoose from "mongoose";

const userScheema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userScheema);
