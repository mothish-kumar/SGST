import express from 'express'
import { feedBack, guardHire } from '../controllers/clientController.js'

const router = express.Router()

router.post('/hire',guardHire)
router.post('/feedback/:id',feedBack)

export default router  