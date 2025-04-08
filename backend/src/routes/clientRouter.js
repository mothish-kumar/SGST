import express from 'express'
import { feedBack, feedbacks, guardHire } from '../controllers/clientController.js'

const router = express.Router()

router.post('/hire',guardHire)
router.post('/feedback/:id',feedBack)
router.get('/getFeedbacks',feedbacks)

export default router  