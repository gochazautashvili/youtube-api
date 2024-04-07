import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    video_url: { type: String, required: true, },
    image_url: { type: String, required: true, },
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    channelID: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'users' },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    views: { type: [String], default: [] }
}, { timestamps: true })

const videoModule = mongoose.model('videos', videoSchema)
export default videoModule