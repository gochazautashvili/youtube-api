import videoModule from "../models/video.model.js"
import authModule from "../models/auth.model.js"
import fetch from 'node-fetch'

export const addVideo = async (req, res) => {
    const { title, description, video_url, image_url } = req.body

    try {
        const newVideo = await videoModule.create({ title, description, video_url, image_url, channelID: req.user.id })

        res.status(200).json(newVideo)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const deleteVideo = async (req, res) => {
    const { videoID } = req.query

    try {
        const video = await videoModule.findById(videoID)
        console.log(video, req.user.id);

        if (video.channelID != req.user.id) {
            return res.status(400).json({ error: 'this video is not yours' })
        }

        await videoModule.findByIdAndDelete(videoID)

        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(400).json(error)
    }
}

export const updateVideo = async (req, res) => {
    const { title, description, video_url, image_url, videoID } = req.body

    try {
        const video = await videoModule.findById(videoID)

        if (video.channelID !== req.user) {
            return res.status(400).json({ error: 'this video is not yours' })
        }

        const updateVideo = await videoModule.findByIdAndDelete(videoID, {
            title, description, video_url, image_url
        })

        res.status(200).json(updateVideo)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const getVideos = async (req, res) => {
    try {
        const videos = await videoModule.find().populate('channelID')

        res.status(200).json(videos)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const getVideosById = async (req, res) => {
    const { videoID } = req.params

    try {
        const video = await videoModule.findById({ _id: videoID }).populate('channelID')

        res.status(200).json(video)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const getVideoByChannelId = async (req, res) => {
    try {
        const video = await videoModule.find({ channelID: req.user.id })

        res.status(200).json(video)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const getLikedVideoById = async (req, res) => {
    try {
        const user = await authModule.findById({ _id: req.user.id })

        const videos = await videoModule.find({ _id: { $in: user.liked } }).populate('channelID')

        res.status(200).json(videos)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const likeVideo = async (req, res) => {
    const { videoID } = req.params

    try {
        const user = await authModule.findById(req.user.id)

        if (!user.liked.includes(videoID)) {
            await videoModule.findByIdAndUpdate({ _id: videoID },
                {
                    $addToSet: { likes: req.user.id },
                    $pull: { dislikes: req.user.id },
                }
            )

            await authModule.findByIdAndUpdate({ _id: req.user.id },
                {
                    $addToSet: { liked: videoID },
                    $pull: { disliked: videoID },
                }
            )
        } else {
            await authModule.findByIdAndUpdate({ _id: req.user.id },
                {
                    $pull: { liked: videoID },
                }
            )

            await videoModule.findByIdAndUpdate({ _id: videoID },
                {
                    $pull: { likes: req.user.id },
                }
            )
        }

        res.status(201).json('ok')
    } catch (error) {
        res.status(400).json(error)
    }
}

export const dislikeVideo = async (req, res) => {
    const { videoID } = req.params

    try {
        const video = await videoModule.findByIdAndUpdate({ _id: videoID },
            {
                $addToSet: { dislikes: req.user.id },
                $pull: { likes: req.user.id }
            }
        )

        await authModule.findByIdAndUpdate({ _id: req.user.id },
            {
                $addToSet: { disliked: videoID },
                $pull: { liked: videoID },
            }
        )

        res.status(201).json(video)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const subscribe = async (req, res) => {
    const { channelID } = req.params

    try {
        if (channelID == req.user.id) {
            return res.status(400).json({ error: 'it is you' })
        }

        const subUser = await authModule.findById({ _id: req.user.id })

        if (subUser.subscribed.includes(channelID)) {
            await authModule.findByIdAndUpdate({ _id: channelID }, {
                $pull: { subscribers: req.user.id }
            })

            const subChannel = await authModule.findByIdAndUpdate({ _id: req.user.id }, {
                $pull: { subscribed: channelID }
            })

            await subChannel.save()

            res.status(201).json({ data: null })
        } else {
            const subChannel = await authModule.findByIdAndUpdate(
                { _id: channelID },
                { $push: { subscribers: req.user.id } }
            )

            await authModule.findByIdAndUpdate({ _id: req.user.id }, {
                $push: { subscribed: channelID }
            })

            await subChannel.save()

            res.status(201).json(subChannel)
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const history = async (req, res) => {
    const { videoID } = req.params

    try {
        const user = await authModule.findById(req.user.id)

        if (!user.history.includes(videoID)) {
            await authModule.findByIdAndUpdate(req.user.id, {
                $addToSet: { history: videoID }
            })

            await videoModule.findByIdAndUpdate(videoID, {
                $addToSet: { views: req.user.id }
            })
        }

        res.status(201).json('')
    } catch (error) {
        res.status(400).json(error)
    }
}

export const downloadVideo = async (req, res) => {
    try {
        const imageUrl = req.query.imageUrl;

        if (!imageUrl) {
            return res.status(400).send('Image URL is required');
        }

        const response = await fetch(imageUrl);

        if (!response.ok) {
            return res.status(response.status).send(`Error fetching image: ${response.statusText}`);
        }

        res.set('Content-Type', response.headers.get('content-type'));
        res.send(await response.buffer());
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const Subscriptions = async (req, res) => {
    try {
        const channels = await authModule.findById(req.user.id).populate('subscribed').lean().exec()
        const subscribedChannelIds = channels.subscribed.map(channel => channel._id);
        const videos = await videoModule.find({ channelID: { $in: subscribedChannelIds } }).populate('channelID')

        res.status(200).json(videos)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const SubscriptionsChannels = async (req, res) => {
    try {
        const channels = await authModule.findById(req.user.id).populate('subscribed').lean().exec()


        res.status(200).json(channels)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

export const yourHistory = async (req, res) => {
    try {
        const user = await authModule.findById(req.user.id)
        const videos = await videoModule.find({ _id: { $in: user.history } }).populate('channelID')

        console.log(videos);

        res.status(200).json(videos)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const channels = async (req, res) => {
    const { channelID } = req.params

    try {
        const user = await authModule.findById({ _id: channelID })

        const video = await videoModule.find({ channelID: user._id }).populate('channelID')

        res.status(200).json({ video, user })
    } catch (error) {
        res.status(400).json(error)
        console.log(error);
    }
}

export const search = async (req, res) => {
    const { path } = req.query


    try {
        const videos = await videoModule.find({ description: { $regex: path, $options: "i" } }).populate('channelID')

        res.status(200).json(videos)
    } catch (error) {
        res.status(400).json(error)
    }
}