import express from 'express'
import {grantPoints } from '../controllers/pointController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/', grantPoints)


export default router