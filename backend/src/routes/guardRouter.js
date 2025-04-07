import express from 'express';
import { applyGuard,  completeWork,  getAssignedWork,  guardLogin, startWork } from '../controllers/guardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/apply',applyGuard)
router.post('/login',guardLogin)
router.get('/assignedWork',authMiddleware,getAssignedWork)
router.post('/startWork/:id',authMiddleware,startWork)
router.post('/completeWork/:id',authMiddleware,completeWork)


export default router;