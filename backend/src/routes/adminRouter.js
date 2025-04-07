import express from 'express'
import { adminLogin,getAllBookings,acceptBooking, rejectBooking, sendPaymentQR, markPaymentAsPaid, getWorkStatus, getDashboardData } from '../controllers/adminController.js'
import {authMiddleware} from '../middlewares/authMiddleware.js'
import { getGuards, approveGuard, rejectGuard, deleteGuard, getGuardById } from '../controllers/guardController.js'
const router = express.Router()

router.post('/login',adminLogin)
router.get('/bookings',authMiddleware,getAllBookings)
router.post('/acceptBooking/:id',authMiddleware,acceptBooking)
router.post('/rejectBooking/:id',authMiddleware,rejectBooking)
router.get('/getGuards',authMiddleware,getGuards)
router.post('/approveGuard/:id',authMiddleware,approveGuard)
router.post('/rejectGuard/:id',authMiddleware,rejectGuard)
router.delete('/deleteGuard/:id',authMiddleware,deleteGuard)
router.get('/getGuard/:id',authMiddleware,getGuardById)
router.get('/workStatus',authMiddleware,getWorkStatus)
router.post('/sendPaymentMail/:bookingId',authMiddleware,sendPaymentQR)
router.post('/sendPaymentCompleteMail/:bookingId',authMiddleware,markPaymentAsPaid)
router.get('/getDashboardData',authMiddleware,getDashboardData) 

export default router 