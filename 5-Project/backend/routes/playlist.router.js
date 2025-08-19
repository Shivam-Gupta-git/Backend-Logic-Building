import express from 'express'
import { createPlaylist, getUserPlaylist } from '../controllers/playlist.controllers.js'
import { userAuth } from '../middleware/auth.middleware.js'

const playlistRouter = express.Router()

playlistRouter.post('/createPlaylist',userAuth, createPlaylist)
playlistRouter.get('/getUserPlaylist/:owner', userAuth, getUserPlaylist)

export { playlistRouter }