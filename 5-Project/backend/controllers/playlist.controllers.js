import { Playlist } from "../model/playlist.model.js";
import { User } from "../model/user.model.js";

export const createPlaylist = async (req, res) => {
 try {
   const { name, description } = req.body;
   if([name, description].some((fields) => 
     fields?.trim() === ""
   )){
     return res.status(400).json({success: false, message: "all fields are required"})
   }
  
   const videoPlaylist = new Playlist({
    name: name.trim(),
    description: description.trim(),
    owner: req.registeredUser._id,
    videos: []
   })

   const saveVideoPlaylist = await videoPlaylist.save()

   if(!saveVideoPlaylist){
    return res.status(400).json({success: false, message: "video playlist can't be saved"})
   }

   return res.status(200).json({success: true, message: "Playlist create successfully", data: saveVideoPlaylist})
 } catch (error) {
  console.error("Error while creating playlist:", error)
  return res.status(500).json({success: false, message: "Error while creating playlist", error: error.message})
 }
}

export const getUserPlaylist = async (req, res) => {
try {
    const { owner } = req.params;
    if(!owner?.trim()){
      return res.status(400).json({success: false, message: "user id is required"})
    }
  
    const existingUserId = await User.findById(owner);
    if(!existingUserId){
      return res.status(400).json({success: false, message: "user not found"})
    }
  
    const getAllPlaylist = await Playlist.find({ owner })
    if(!getAllPlaylist.length){
      return res.status(400).json({success: false, message: "No playlist found for user"})
    }
  
    return res.status(200).json({success: true, message: "playList fetching successfully", data: getAllPlaylist})
} catch (error) {
  console.error("Error while in getUserPlaylist")
  return res.status(500).json({success: false, message: error.message})
}
}