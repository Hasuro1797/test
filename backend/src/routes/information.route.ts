import express from 'express'
import { addInformation, getInformation } from '../services/information.service'

const router = express.Router()

router.get('/', getInformation)

router.post('/', addInformation)

export default router