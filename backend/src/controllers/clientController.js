import Client from "../models/Client.js"
import Joi from 'joi'
import Booking from "../models/Booking.js";

const hireGuardSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    num_guards: Joi.number().min(1).required(),
    shift: Joi.string().valid("Day", "Night").required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    address: Joi.string().min(5).required()
});

export const guardHire = async (req, res) => {
    const { error } = hireGuardSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try{
        const {name,phone,email,num_guards,shift,gender,address} = req.body
        const newBooking = new Client({
            name,phone,email,num_guards,shift,gender,address
        })
        await newBooking.save()
        res.status(201).json({message: "Booking created successfully"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const feedBack = async (req, res) => {
    try{
        const { rating, comment } = req.body;
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.client_feedback = {
            rating,
            comment
        };
        await booking.save();
        res.status(200).json({ message: "Feedback submitted successfully" });
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
