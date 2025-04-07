import mongoose from "mongoose";

const GuardSchema = new mongoose.Schema(
  {
    profile_photo: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String}, 
    address: { type: String, required: true },
    id_type: { type: String, required: true },
    id_picture: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    assigned_work: [
      {
        booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        client_name: String, 
        location: String,
        shift: String,
        attendance_status: { type: String, enum: ["Absent", "Present"], default: "Absent" },
        live_location: {
          lat: Number,
          lng: Number,
        },
        shift_status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
        start_time: { type: Date }, 
        end_time: { type: Date },
      },
    ],
    rating: { type: Number, default: 0 },
    payment_details: {
      total_earnings: { type: Number, default: 0 },
      last_payment_date: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guard", GuardSchema);
