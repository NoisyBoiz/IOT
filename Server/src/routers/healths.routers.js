import express from 'express'
import { getHealth, postHealth } from '../controllers/health.controllers.js'

const router = express.Router()

router.get('/:_id/:date', getHealth)
router.post('/', postHealth)

export default router
