import express from 'express'
import { Login, Register, channel } from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/', channel)
router.post('/register', Register)
router.post('/login', Login)

export default router