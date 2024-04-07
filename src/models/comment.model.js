import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    channelID: { type: String, required: true, ref: "users" },
    videoID: { type: String, required: true },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    description: { type: String, required: true },
}, { timestamps: true })

const commentModule = mongoose.model('comments', commentSchema)
export default commentModule
