import express from "express"
import { userAuth } from "../middleware/auth.middleware.js"
import { getChannelState, getChannelVideos } from "../controllers/dashboard.controllers.js";

const dashboard = express.Router();

dashboard.get('/status',userAuth, getChannelState );
dashboard.get("/getchannelVideos", userAuth, getChannelVideos);

export { dashboard }