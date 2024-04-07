import express from 'express'
import { Comment, deleteComment, dislikeComment, getComments, likeComment, updateComment } from '../controllers/comment.controller.js'

const router = express.Router()

router.get('/', getComments)
router.post('/', Comment)

router.put('/', updateComment)
router.put('/like', likeComment)
router.put('/dislike', dislikeComment)

router.delete('/', deleteComment)

export default router