import mongoose from "mongoose";
import { Types } from "mongoose";

const patientSchema = new mongoose.Schema({
    _id: { type: Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    height: { type: Number }, 
    weight: { type: Number }, 
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}, // Nhóm máu
    allergies: { type: String }, // Dị ứng
    medications: { type: String }, // Thuốc đang sử dụng
});

const Patients = mongoose.model('patients', patientSchema);

export default Patients;