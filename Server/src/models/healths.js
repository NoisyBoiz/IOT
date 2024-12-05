import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true},
    heartrate: Number,
    spo2: Number,
    createdAt: {type: Date, default: Date.now}
});

const Healths = mongoose.model('healths', healthSchema);

export default Healths;