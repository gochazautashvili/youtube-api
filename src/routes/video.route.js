import express from 'express'
import { Subscriptions, search, addVideo, channels, yourHistory, SubscriptionsChannels, deleteVideo, dislikeVideo, downloadVideo, getLikedVideoById, getVideoByChannelId, getVideos, getVideosById, history, likeVideo, subscribe, updateVideo } from '../controllers/video.controller.js'

const router = express.Router()

// get
router.get('/proxy-image', downloadVideo)
router.get('/', getVideos)
router.get('/subscriptions', Subscriptions)
router.get('/subscriptionsChannels', SubscriptionsChannels)
router.get('/single/:videoID', getVideosById)
router.get('/channel', getVideoByChannelId)
router.get('/liked', getLikedVideoById)
router.get('/yourHistory', yourHistory)
router.get('/channelsByID/:channelID', channels)
router.get('/search', search)

// put
router.put('/', updateVideo)
router.put('/like/:videoID', likeVideo)
router.put('/dislike/:videoID', dislikeVideo)
router.put('/subscribe/:channelID', subscribe)
router.put('/history/:videoID', history)

// delete
router.delete('/', deleteVideo)

// post
router.post('/', addVideo)

export default router