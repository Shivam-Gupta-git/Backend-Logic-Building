import express from 'express'
import { addVideoInPlaylist, createPlaylist, getUserPlaylist, getUserPlaylistById, removeVideoInPlaylist, updatePlaylist } from '../controllers/playlist.controllers.js'
import { userAuth } from '../middleware/auth.middleware.js'

const playlistRouter = express.Router()

playlistRouter.post('/createPlaylist',userAuth, createPlaylist)
playlistRouter.get('/getUserPlaylist/:owner', userAuth, getUserPlaylist)
playlistRouter.get('/getUserPlaylistById/:playlistId', userAuth, getUserPlaylistById)
playlistRouter.patch('/addVideoInPlaylist/:videoId/:playlistId', userAuth, addVideoInPlaylist)
playlistRouter.delete('/removeVideoInPlaylist/:videoId/:playlistId', userAuth, removeVideoInPlaylist)
playlistRouter.patch('/updatePlaylist/:playlistId', userAuth, updatePlaylist)

export { playlistRouter }