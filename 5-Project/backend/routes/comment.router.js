import express from "express";
import { userAuth } from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getComment,
  updateComment,
} from "../controllers/comment.controllers.js";

const commentRouter = express.Router();

commentRouter.post("/addComment/:videoId", userAuth, addComment);
commentRouter.get("/getComment/:videoId", userAuth, getComment);
commentRouter.patch("/updateComment/:commentId", userAuth, updateComment);
commentRouter.delete("/deleteComment/:commentId", userAuth, deleteComment);

export { commentRouter };
