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
};

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
};

export const getUserPlaylistById = async (req, res) => {
try {
   const { playlistId } = req.params;
   if(!playlistId?.trim()){
    return res.status(400).json({success: false, message: "playlist Id is required"})
   }
   
   const existingPlaylistId = await Playlist.findById(playlistId)
   if(!existingPlaylistId){
    return res.status(400).json({success: false, message: "Playlist Id not found"})
   }
  
   return res.status(200).json({success: true, message: "existing playlist id fetching successfully", data: existingPlaylistId})
} catch (error) {
  console.error("Error while in getUserPlaylistById", error)
  return res.status(500).json({success: false, message: error.message})
}
};

export const addVideoInPlaylist = async (req, res) => {
try {
    const { videoId, playlistId } = req.params;
  
    if(!videoId?.trim()){
      return res.status(400).json({success: false, message: "Video Id is required"})
    }
  
    if(!playlistId?.trim()){
      return res.status(400).json({success: false, message: "playlist Id is required"})
    }
  
    const userPlaylist = await Playlist.findById(playlistId)
    if(!userPlaylist){
      return res.status(400).json({success: false, message: "playlist Id not found"})
    }
    if(userPlaylist.videos.includes(videoId)){
      return res.status(400).json({ success: false, message: "Video already exists in this playlist" });
    }
  
    userPlaylist.videos.push(videoId);
    await userPlaylist.save()
  
    return res.status(200).json({success: true, message: "Video added to playlist successfully", data: userPlaylist})
} catch (error) {
  console.error("Error while in addVideoInPlaylist", error)
  return res.status(500).json({success: false, message: error.message})
}
};

export const removeVideoInPlaylist = async (req, res) => {
 try {
  const { videoId, playlistId } = req.params;
  if(!videoId?.trim()){
   return res.status(400).json({success: false, message: "video Id is required"})
  }
 
  if(!playlistId?.trim()){
   return res.status(400).json({success: false, message: "playlist Id is required"})
  }
 
  const userPlaylist = await Playlist.findById(playlistId)
  if(!userPlaylist){
   return res.status(400).json({success: false, message: "playlist Id is not found"})
  }
 
  await Playlist.findByIdAndUpdate
  (playlistId,{
    $pull:{ videos: videoId },
  },
  {new: true}
  )
  return res.status(200).json({success: true, message: "removeVideoInPlaylist is successfully"})
 } catch (error) {
  console.error("Error while in removeVideoInPlaylist")
  return res.status(500).json({success: false, message: error.message})
 }
};

export const updatePlaylist = async (req, res) => {
 try {
   const { playlistId } = req.params
   const { name, description } = req.body;
 
   if(!playlistId?.trim()){
     return res.status(400).json({success: false, message: "playlist Id is required"})
   }
   if([name, description].some((fields) => fields?.trim() === "")){
     return res.status(400).json({success: false, message: "all fields are required"})
   }
 
   const existingPlaylistId = await Playlist.findById(playlistId)
   if(!existingPlaylistId){
     return res.status(400).json({success: false, message: "playlist Id is not found"})
   }
 
   const updatePlaylist = await Playlist.findByIdAndUpdate(existingPlaylistId, {
     name,
     description
   })
 
   return res.status(200).json({success: true, message: "updating playlist successfully", data: updatePlaylist})
 } catch (error) {
  console.error("Error while in updatePlaylist", error)
  return res.status(500).json({success: false, message: error.message})
 }
};

