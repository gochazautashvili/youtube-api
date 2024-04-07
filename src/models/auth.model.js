import mongoose from 'mongoose'

const authSchema = new mongoose.Schema({
    gmail: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    subscribers: { type: [String], default: [] },
    subscribed: { type: [mongoose.SchemaTypes.ObjectId], default: [], ref: 'users' },
    liked: { type: [String], default: [] },
    disliked: { type: [String], default: [] },
    history: { type: [String], default: [] },
    likedComment: { type: [String], default: [] },
    dislikedComment: { type: [String], default: [] },
})

const authModule = mongoose.model('users', authSchema)
export default authModule