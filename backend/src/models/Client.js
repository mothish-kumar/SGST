import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    num_guards: { type: Number, required: true },
    shift: { type: String, required: true }, // Day/Night
    gender: { type: String, enum: ["Male", "Female", "Any"], required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    assigned_guard_id: [
       {type: mongoose.Schema.Types.ObjectId, ref: "Guard" }
    ],
    payment_status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  },
  { timestamps: true }
);

export default  mongoose.model("Client", ClientSchema);
