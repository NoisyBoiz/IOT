import express from 'express'
import { getChat, getChatByUserId, getChatESP, postChat } from '../controllers/chat.controllers.js'

const router = express.Router()

router.get('/', getChat)
router.get('/:userId/', getChatByUserId)
router.get('/esp/:userId/:idx', getChatESP)
router.post('/ask', postChat)

export default router
