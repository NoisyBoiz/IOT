import mongoose from "mongoose";
import { Types } from "mongoose";

const assignmentsSchema = new mongoose.Schema({
    _id: { type: Types.ObjectId, auto: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patients'},
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'doctors'},
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'disconnected'], default: 'pending'},
}, { timestamps: true });

const Assignments = mongoose.model('assignments', assignmentsSchema);

export default Assignments;