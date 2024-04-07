import express from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import 'dotenv/config'

import authRouter from './routes/auth.route.js'
import videoRouter from './routes/video.route.js'
import commentRouter from './routes/comment.route.js'
import { auth } from './middleware/auth.js'

const app = express()

app.use(compression())
app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)
app.use('/video', auth, videoRouter)
app.use('/comment', auth, commentRouter)

const PORT = process.env.PORT | 8000


mongoose.connect(process.env.MONGO_DB).then(() => {
    app.listen(PORT, () => {
        console.log("Server is running port 8000");
    })
})