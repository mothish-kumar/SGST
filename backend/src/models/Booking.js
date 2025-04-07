import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    client_name: { type: String, required: true },
    client_email: { type: String, required: true },
    client_phone: { type: String, required: true },
    num_guards: { type: Number, required: true },
    shift: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    assigned_guards: [
      {
        guard_id: { type: mongoose.Schema.Types.ObjectId, ref: "Guard" },
        guard_name: String,
        attendance: { type: String, enum: ["Pending", "Present", "Absent"], default: "Pending" },
        location_tracking: [
          { lat: Number, lng: Number, timestamp: { type: Date, default: Date.now } },
        ],
        shift_status: { type: String, enum: ["Pending", "Ongoing", "Completed"], default: "Pending" },
        start_time: { type: Date }, 
        end_time: { type: Date },
      },
    ],
    payment_status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    client_feedback: {
      rating: { type: Number },
      comment: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
