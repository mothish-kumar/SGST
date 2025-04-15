import multer from "multer";
import path from "path";
import fs from "fs";
import Joi from "joi";
import Guard from "../models/Guard.js";
import { sendMail } from "../services/mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";

const profilePhotoPath = "uploads/profile_photos";
const idPicturePath = "uploads/id_pictures";

fs.mkdirSync(profilePhotoPath, { recursive: true });
fs.mkdirSync(idPicturePath, { recursive: true });

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profile_photo") {
            cb(null, profilePhotoPath);
        } else if (file.fieldname === "id_picture") {
            cb(null, idPicturePath);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.body.email.replace(/[@.]/g, "_")}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Multer Upload Middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error("Only images and PDFs are allowed"), false);
        }
        cb(null, true);
    }
}).fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "id_picture", maxCount: 1 }
]);


const guardSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    address: Joi.string().min(5).required(),
    id_type: Joi.string().valid("Aadhar", "PAN", "Passport", "Driving License").required()
});

export const applyGuard = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            // Validate request body using Joi
            const { error } = guardSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { name, phone, email, address, id_type } = req.body;
            const profile_photo = req.files.profile_photo ? req.files.profile_photo[0].filename : null;
            const id_picture = req.files.id_picture ? req.files.id_picture[0].filename : null;

            const newGuard = new Guard({
                profile_photo,
                name,
                phone,
                email,
                address,
                id_type,
                id_picture
            });

            await newGuard.save();
            res.status(201).json({ message: "Guard application submitted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

export const guardLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password"});
        }
        const guard = await Guard.findOne({email});
        if(!guard){
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password,guard.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }
        const token = jwt.sign({id: guard._id, role: "guard"}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000
        });
        res.status(200).json({message: "Login successful",token,id:guard._id});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getGuards = async (req, res) => {
    const role = req.role
    if(role !== "admin"){
        return res.status(401).json({message: "No Permission access for this route"});
    }
    try{
        let guards = await Guard.find();
        const status = req.query.status|| "Pending";
        if(status){
            guards = guards.filter(guard => guard.status === status);
        }
        if(guards.length === 0){
            return res.status(404).json({message: `No guards found in ${status} status`});
        }
        res.status(200).json(guards);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getGuardById = async (req, res) => {
    const { id } = req.params;  
    try {
        const guard = await Guard.findById(id);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        res.status(200).json(guard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const approveGuard = async (req, res) => {
    const { id } = req.params;
    const role = req.role
    if(role !== "admin"){
        return res.status(401).json({message: "No Permission access for this route"});
    }
    try {
        const guard = await Guard.findById(id);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        const plainPassword = `${guard.email.split("@")[0]}_SG${Date.now().toString().slice(-4)}`;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        guard.status = "Approved";
        guard.password = hashedPassword;
        await guard.save();
        // Send email notification to the guard
        sendMail(
            guard.email,
            "Guard Application Approved",
            `Dear ${guard.name},\n\nYour application has been approved. Welcome aboard!\n\nHere are your login credentials:\n\nEmail: ${guard.email}\nPassword: ${plainPassword}\n\nBest regards,\nThe Team`
        );
        res.status(200).json({ message: "Guard approved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectGuard = async (req, res) => {
    const { id } = req.params;
    const role = req.role
    if(role !== "admin"){
        return res.status(401).json({message: "No Permission access for this route"});
    }
    const { reason } = req.body;
    if (!reason) {
        return res.status(400).json({ message: "Reason for rejection is required" });
    }
    try {
        const guard = await Guard.findById(id);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        guard.status = "Rejected";
        await guard.save();
        // Send email notification to the guard
        sendMail(
            guard.email,
            "Guard Application Rejected",
            `Dear ${guard.name},\n\nWe regret to inform you that your application has been rejected.\n\n Rejected Reason : ${reason}\n\nBest regards,\nThe Team `
        );
        res.status(200).json({ message: "Guard rejected successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGuard = async (req, res) => {
    const { id } = req.params;
    const role = req.role
    if(role !== "admin"){
        return res.status(401).json({message: "No Permission access for this route"});
    }
    try {
        const guard = await Guard.findById(id);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        await Guard.deleteOne({ _id: id });
        res.status(200).json({ message: "Guard deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAssignedWork = async (req, res) => {
    const role = req.role;
    const id = req.id;
    const shift_status = req.query.status || "Pending"; // Get status from query params, default "Pending"

    if (role !== "guard") {
        return res.status(401).json({ message: "No Permission access for this route" });
    }

    try {
        const guard = await Guard.findById(id).populate({
            path: "assigned_work.booking_id",
            model: "Booking",
            select: "client_name client_email client_phone address shift_status",
        });

        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }

        const assignedWork = guard.assigned_work.filter(work => work.shift_status === shift_status); // Filter based on query param

        if (assignedWork.length === 0) {
            return res.status(404).json({ message: `No assigned work found for status: ${shift_status}` });
        }

        res.status(200).json(assignedWork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const startWork = async (req, res) => {
    try{
        const guardId = req.id;
        const booking_id = req.params.id
        const {lat,lng} = req.body

        //Booking Schema Saves
        const booking = await Booking .findById(booking_id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const assignedGuard = booking.assigned_guards.find(g => g.guard_id.toString() === guardId);
        if (!assignedGuard) {
            return res.status(403).json({ message: "You are not assigned to this booking" });
        }

        assignedGuard.shift_status = "Ongoing";
        assignedGuard.attendance = "Present";
        assignedGuard.location_tracking = [{ lat, lng, timestamp: new Date() }];
        assignedGuard.start_time = new Date();
        await booking.save()

        //Guard Schema Saves
        const guard = await Guard.findById(guardId);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        const assignedWork = guard.assigned_work.find(work => work.booking_id.toString() === booking_id);
        if (!assignedWork) {
            return res.status(404).json({ message: "Assigned work not found" });
        }
        assignedWork.shift_status = "Ongoing";
        assignedWork.attendance_status = "Present";
        assignedWork.live_location = { lat, lng };
        assignedWork.start_time = new Date();
        await guard.save();

        res.status(200).json({ message: "Work started successfully" });

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const completeWork = async (req, res) => {
    try{
        const guardId = req.id;
        const booking_id = req.params.id
          //Booking Schema Saves
          const booking = await Booking .findById(booking_id);
          if (!booking) {
              return res.status(404).json({ message: "Booking not found" });
          }
          const assignedGuard = booking.assigned_guards.find(g => g.guard_id.toString() === guardId);
          if (!assignedGuard) {
              return res.status(403).json({ message: "You are not assigned to this booking" });
          }
  
          assignedGuard.shift_status = "Completed";
          assignedGuard.end_time = new Date();
          await booking.save()

          //Guard Schema Saves
        const guard = await Guard.findById(guardId);
        if (!guard) {
            return res.status(404).json({ message: "Guard not found" });
        }
        const assignedWork = guard.assigned_work.find(work => work.booking_id.toString() === booking_id);
        if (!assignedWork) {
            return res.status(404).json({ message: "Assigned work not found" });
        }
        assignedWork.shift_status = "Completed";
        assignedWork.end_time = new Date();
        guard.salary_paid = false
        await guard.save();
        await sendMail(
            booking.client_email,
            "Security Service Feedback",
            `Dear ${booking.client_name}, your security service has been completed. Please rate the service using the following link: ${process.env.FEEDBACK_LINK}/${booking._id}`
        );
        res.status(200).json({ message: "Work completed successfully" });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}