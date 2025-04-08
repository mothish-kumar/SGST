import jwt from 'jsonwebtoken'
import Client from '../models/Client.js'
import Guard from '../models/Guard.js'
import Booking from '../models/Booking.js'
import { sendMail } from "../services/mail.js";


export const adminLogin = (req, res) => {   
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message: 'Please fill in all fields'})
        }
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.status(401).json({message: 'Invalid credentials'})
        }
        const token  = jwt.sign({email,role:'admin'}, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 3600000,
            path: "/"
        });
        res.status(200).json({message: 'Login successful',token})
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
} 

export const getAllBookings = async (req, res) => {
    try{
        const status  = req.query.status || "Pending"
        const bookings = await Client.find({status})
        if(!bookings){
            return res.status(404).json({message: 'No bookings found'})
        }
        res.status(200).json(bookings)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}

export const acceptBooking = async (req, res) => {
    const id = req.params.id;
    const { guardIds } = req.body;
    
    if (!guardIds || !Array.isArray(guardIds) || guardIds.length === 0) {
        return res.status(400).json({ message: "At least one guard ID is required" });
    }
    
    try {
        const clientRequest = await Client.findById(id);
        if (!clientRequest) {
            return res.status(404).json({ message: "Client request not found" });
        }
        
        // Fetch guard details
        const guards = await Guard.find({ _id: { $in: guardIds } }, "name phone email");
        
        // Create a new Booking entry
        const newBooking = new Booking({
            client_id: clientRequest._id,
            client_name: clientRequest.name,
            client_email: clientRequest.email,
            client_phone: clientRequest.phone,
            num_guards: clientRequest.num_guards,
            shift: clientRequest.shift,
            address: clientRequest.address,
            status: "Accepted",
            assigned_guards: guards.map(guard => ({
                guard_id: guard._id,
                guard_name: guard.name,
                shift_status: "Pending",
                attendance: "Pending"
            })),
            payment_status: "Unpaid"
        });
        
        await newBooking.save();
        
        // Update Client Request Status
        clientRequest.status = "Accepted";
        clientRequest.assigned_guard_id = guardIds;
        await clientRequest.save();
        

        // Update Guards with assigned work
        const assignedWorkEntry = {
            booking_id: newBooking._id,
            client_name: clientRequest.name,
            location: clientRequest.address, 
            shift: clientRequest.shift,
            attendance_status: "Absent",
            shift_status: "Pending",
        };
        await Guard.updateMany(
            { _id: { $in: guardIds } },
            { $push: { assigned_work: assignedWorkEntry } }
        );
        
        // Send email to client with assigned guard details
        const guardDetails = guards.map(g => `Name: ${g.name}, Phone: ${g.phone}, Email: ${g.email}`).join("\n");
        const emailContent = `Your security guards have been assigned:\n\n${guardDetails}\n\nThank you for choosing our service.`;
        await sendMail(clientRequest.email, "Security Guard Assignment", emailContent);
        
        res.status(200).json({ message: "Booking accepted and assigned to guards." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const rejectBooking = async (req, res) => {
    const id = req.params.id;
    const { reason } = req.body;
    
    if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
    }
    
    try {
        const clientRequest = await Client.findById(id);
        if (!clientRequest) {
            return res.status(404).json({ message: "Client request not found" });
        }
        
        // Update Client Request Status
        clientRequest.status = "Rejected";
        await clientRequest.save();
        
        // Send rejection email to client
        const emailContent = `Dear ${clientRequest.name},\n\nYour booking request has been rejected.\nReason: ${reason}\n\nWe apologize for any inconvenience.`;
        await sendMail(clientRequest.email, "Booking Request Rejected", emailContent);
        
        res.status(200).json({ message: "Booking rejected and client notified." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getWorkStatus = async (req, res) => {
    const status  = req.query.status || "Pending"
    try{
        const Works = await Booking.find({ "assigned_guards.shift_status": status })
            .populate("client_id", "name email phone address")
            .populate("assigned_guards.guard_id", "name phone");

        if (!Works || Works.length === 0) {
            return res.status(404).json({ message: "No work status found" });
        }
        res.status(200).json(Works);
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}

export const sendPaymentQR = async (req, res) => {
    const { bookingId } = req.params;
    const {amount} = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.payment_status !== "Unpaid") {
            return res.status(400).json({ message: "Payment already completed" });
        }

 
        const qrCodeUrl = "http://example.com/paymentLink"; 


        await sendMail(
            booking.client_email,
            "Security Guard Service Payment",
            `
            <p>Dear ${booking.client_name},</p>
            <p>Please scan the QR code below to complete your payment:</p>
            <p><strong>Amount: ${amount}</strong></p>
            <img src="${qrCodeUrl}" alt="Payment QR Code" width="200" height="200"/>
            <p>Or click this link if the image is not displayed: <a href="${qrCodeUrl}">${qrCodeUrl}</a></p>
            <p>Thank you!</p>
            `
        );

        res.status(200).json({ message: "Payment QR Code sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const markPaymentAsPaid = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.payment_status === "Paid") {
            return res.status(400).json({ message: "Payment already marked as Paid" });
        }

        // Mark as Paid
        booking.payment_status = "Paid";
        await booking.save();

        // Send Confirmation Email
        await sendMail(
            booking.client_email,
            "Payment Confirmed",
            `Dear ${booking.client_name}, your payment has been successfully received.`
        );

        res.status(200).json({ message: "Payment marked as Paid & email sent" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalGuards = await Guard.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });
        const acceptedBookings = await Booking.countDocuments({ status: "Accepted" });
        const rejectedBookings = await Booking.countDocuments({ status: "Rejected" });

        const activeGuards = await Booking.distinct("assigned_guards.guard_id", { 
            status: "Accepted", 
            "assigned_guards.shift_status": "Ongoing"
        });
        const inactiveGuards = totalGuards - activeGuards.length;

        const ongoingWorks = await Booking.countDocuments({ "assigned_guards.shift_status": "Ongoing" });
        const completedWorks = await Booking.countDocuments({ "assigned_guards.shift_status": "Completed" });

        const ratingsData = await Booking.aggregate([
            { $match: { "client_feedback.rating": { $exists: true } } },
            { $group: { _id: null, avgRating: { $avg: "$client_feedback.rating" } } }
        ]);
        const avgRating = ratingsData.length > 0 ? ratingsData[0].avgRating.toFixed(1) : "No Ratings Yet";

        const pendingPayments = await Booking.countDocuments({ payment_status: "Unpaid" });
        const completedPayments = await Booking.countDocuments({ payment_status: "Paid" });

        res.status(200).json({
            totalClients,
            totalGuards,
            totalBookings,
            pendingBookings,
            acceptedBookings,
            rejectedBookings,
            activeGuards: activeGuards.length,
            inactiveGuards,
            ongoingWorks,
            completedWorks,
            avgRating,
            pendingPayments,
            completedPayments
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

