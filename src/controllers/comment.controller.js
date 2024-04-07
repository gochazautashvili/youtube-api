import commentModule from '../models/comment.model.js'
import authModule from '../models/auth.model.js'

export const getComments = async (req, res) => {
    const { videoID } = req.query
    try {
        const comments = await commentModule.find({ videoID }).populate('channelID')

        res.status(200).json(comments)
    } catch (error) {
        res.status(404).json({ error: "this is't comments!" })
    }
}

export const Comment = async (req, res) => {
    const { videoID, description } = req.body

    try {
        const comments = await (await commentModule.create({ videoID, description, channelID: req.user.id })).populate('channelID')

        res.status(200).json(comments)
    } catch (error) {
        res.status(400).json({ error: "try again" })
    }
}

export const likeComment = async (req, res) => {
    const { commentID } = req.query

    try {
        const user = await authModule.findById(req.user.id)

        if (!user.likedComment.includes(commentID)) {
            await commentModule.findByIdAndUpdate(commentID, {
                $addToSet: { likes: req.user.id },
                $pull: { dislikes: req.user.id }

            })
            await authModule.findByIdAndUpdate(req.user.id, {
                $addToSet: { likedComment: commentID },
                $pull: { dislikedComment: commentID }
            })
        } else {
            await commentModule.findByIdAndUpdate(commentID, {
                $pull: { likes: req.user.id }
            })
            await authModule.findByIdAndUpdate(req.user.id, {
                $pull: { likedComment: commentID }
            })
        }

        res.status(201).json({ message: "success" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "can't liked" })
    }
}

export const dislikeComment = async (req, res) => {
    const { commentID } = req.query

    try {
        const user = await authModule.findById(req.user.id)
        if (!user.dislikedComment.includes(commentID)) {
            await commentModule.findByIdAndUpdate(commentID, {
                $addToSet: { dislikes: req.user.id },
                $pull: { likes: req.user.id }
            })
            await authModule.findByIdAndUpdate(req.user.id, {
                $addToSet: { dislikedComment: commentID },
                $pull: { likedComment: commentID }
            })
        } else {
            await commentModule.findByIdAndUpdate(commentID, {
                $pull: { dislikes: req.user.id }
            })
            await authModule.findByIdAndUpdate(req.user.id, {
                $pull: { dislikedComment: commentID }
            })
        }

        res.status(201).json({ message: "success" })
    } catch (error) {
        res.status(400).json({ error: "can't disliked" })
    }
}

export const deleteComment = async (req, res) => {
    const { commentID } = req.query

    try {
        await commentModule.findByIdAndDelete(commentID)
        await authModule.findByIdAndUpdate(req.user.id, {
            $pull: { likedComment: commentID },
            $pull: { dislikedComment: commentID }
        })

        res.status(200).json({ message: 'deleted' })
    } catch (error) {
        res.status(400).json({ error: 'error' })
    }
}

export const updateComment = async (req, res) => {
    const { commentID } = req.query
    const { description } = req.body

    try {
        await commentModule.findByIdAndUpdate(commentID, { description })

        res.status(200).json({ message: 'updated' })
    } catch (error) {
        res.status(400).json({ error: 'error' })
    }
}