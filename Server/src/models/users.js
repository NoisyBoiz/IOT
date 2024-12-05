import mongoose from "mongoose";
import { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    username: { type: String, required: true},
    password: { type: String, required: true},
    phone: { type: String},
    address: { type: String},
    dob: {type: Date},
    image: {type: String},
    gender: {type: String, enum: ['male', 'female', 'other']},
    role: { type: String, enum: ['doctor', 'patient'], required: true},
}, { timestamps: true });

const Users = mongoose.model('users', userSchema);

export default Users;