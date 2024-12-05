import mongoose from "mongoose";
import { Types } from "mongoose";

const doctorSchema = new mongoose.Schema({
    _id: { type: Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    specialty: { type: String}, // chuyen nganh
    licenseNumber: { type: String},
    licenseIssueDate: { type: Date}, // Ngày cấp giấy phép
    hospital: { type: String}, // Bệnh viện làm việc
    yearsOfExp: { type: Number}, // Số năm kinh nghiệm
});

const Doctors = mongoose.model('doctors', doctorSchema);

export default Doctors;