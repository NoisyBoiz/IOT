import Users from "../models/users.js"
import Patients from "../models/patients.js"
import Doctors from "../models/doctors.js"
import Assignments from "../models/assignments.js"
import { populate } from "dotenv"

export const updateProfile = async (req, res) => {
  const {_id, fullname, phone, address, dob, gender} = req.body;

  if (phone && !/^\d{10,15}$/.test(phone)) 
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ.' });
    
  try {
      const user = await Users.findById(_id);
      if (!user) return res.status(404).json({message: 'Người dùng không tồn tại.'});

      console.log(user.dob)

      if(fullname) user.fullname = fullname;
      if(phone) user.phone = phone;
      if(address) user.address = address;
      if(dob) user.dob = dob;
      if(gender) user.gender = gender;

      if(user.role == "patient"){
          const {height, weight, bloodType, allergies, medications} = req.body;
          const patient = await Patients.findById(user._id);
          if (!patient) return res.status(404).json({ message: 'Bệnh nhân không tồn tại.'});

          if(height) patient.height = height;
          if(weight) patient.weight = weight;
          if(bloodType) patient.bloodType = bloodType;
          if(allergies) patient.allergies = allergies;
          if(medications) patient.medications = medications;
          await patient.save();
      }
      else if(user.role == "doctor"){
          const {specialty,licenseNumber, licenseIssueDate,hospital, yearsOfExp} = req.body;

          const doctor = await Doctors.findById(user._id);
          if (!doctor) return res.status(404).json({ message: 'Bác sĩ không tồn tại.' });

          if(specialty) doctor.specialty = specialty;
          if(licenseNumber) doctor.licenseNumber = licenseNumber;
          if(licenseIssueDate) doctor.licenseIssueDate = licenseIssueDate;
          if(hospital) doctor.hospital = hospital;
          if(yearsOfExp) doctor.yearsOfExp = yearsOfExp;
          await doctor.save();
      }
      await user.save();

      let info;
      if(user.role == "patient"){
        info = await Patients.findById(user._id).populate({path: 'user', select: '-_id -password'});
        if (!info) return res.status(404).json({ message: 'Bệnh nhân không tồn tại.'});
      }

      else if(user.role == "doctor"){
        info = await Doctors.findById(user._id).populate({path: 'user', select: '-_id -password'});
        if (!info) return res.status(404).json({ message: 'Bác sĩ không tồn tại.'});
      }
      
      res.status(200).json({message: 'Profile updated successfully', info});
  }
  catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server error'});
  }
}

export const myInfo = async (req, res) => {
  const _id = req.params._id;
  if(!_id) return res.status(400).json({message: 'Missing _id'})
  let info = Patients.findById(_id).populate({path: 'user', select: '-_id -password'});
  if(!info) info = Doctors.findById(_id).populate({path: 'user', select: '-_id -password'});
  if(!info) return res.status(404).json({message: 'User not found'})
  res.status(200).json(info)
}

export const myDoctor = async (req, res) => {
  try {
    const _id = req.params._id;
    if (!_id) return res.status(400).json({ message: 'Missing _id' });
    
    const doctors = await Assignments.find({ patient: _id })
        .populate({
            path: 'doctor',
            populate: {
                path: 'user',
                select: '-_id -password',
            },
        });

    if (!doctors) return res.status(404).json({ message: 'Doctors not found' });
    return res.status(200).json(doctors);
  } 
  catch (error) {
      console.error('Error fetching doctors:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

export const getPatientById = async (req, res) => {
  try {
    const _id = req.params._id;
    if (!_id) return res.status(400).json({ message: 'Missing _id or patient_id' });

    let assignment = await Assignments.findById(_id).populate({path: 'patient', populate: {path: 'user', select: '-_id -password'}});
    if(!assignment) return res.status(404).json({message: 'Assignment not found'})
    return res.status(200).json(assignment);
  }
  catch (error) {
    console.error('Error fetching patient:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

export const getDoctorById = async (req, res) => {
  try {
    const _id = req.params._id;
    const doctor_id = req.params.doctor_id;

    if (!_id || !doctor_id) return res.status(400).json({ message: 'Missing _id or doctor_id' });

    let doctor = await Doctors.findById(doctor_id).populate({ path: 'user', select: '-_id -password' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    let assignment = await Assignments.findOne({
      patient: _id,
      doctor: doctor_id,
      status: { $nin: ["reject", "disconnected"] }
    }).select('-patient -doctor');

    if(assignment) doctor = {...doctor.toObject(), assignment};  
  
    return res.status(200).json(doctor);

  }
  catch (error) {
    console.error('Error fetching doctor:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

export const listDoctor = async (req, res) => {
  const doctors = await Doctors.find().populate({path: 'user', select: '-_id -password'})
  if(!doctors) return res.status(404).json({message: 'Doctor not found'})
  res.status(200).json(doctors)
}

export const requestAssignment = async (req, res) => {
  try {
    const { _id, doctor_id } = req.body;

    if (!_id || !doctor_id) {
      return res.status(400).json({ message: 'Missing patient_id or doctor_id' });
    }
    
    const patient = await Users.findById(_id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    const doctor = await Users.findById(doctor_id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    const exists = await Assignments.findOne({
      patient: _id,
      doctor: doctor_id,
      status: { $nin: ["rejected", "disconnected"] }
    });
    if(exists) return res.status(400).json({ message: 'Assignment already exists' });
    
    const preAssignment = await Assignments.find({ patient: _id });
    const hasPendingOrAccepted = preAssignment.some(assignment => 
      assignment.status === "pending" || assignment.status === "accepted"
    );
    if (hasPendingOrAccepted) {
      return res.status(400).json({ message: 'Patient already has a pending or accepted assignment' });
    }
    
    const assignment = await Assignments.create({ patient: _id, doctor: doctor_id });
    res.status(200).json({ assignment });
  }
  catch (error) {
    console.error('Error requesting assignment:', error);
    res.status(400).json({error})
  }
}

export const responseAssignment = async (req, res) => {
  const {_id, status} = req.body;
  if(!_id || !status) return res.status(400).json({message: 'Missing _id or status'})
  try {
    const assignment = await Assignments.findById(_id);
    if(!assignment) return res.status(404).json({message: 'Assignment not found'})
    assignment.status = status;
    await assignment.save();
    res.status(200).json({assignment})
  }
  catch (error) {
    res.status(400).json({ error })
  }
}

export const getAssignment = async (req, res) => {
  const _id = req.params._id;
  const status = req.params.status;
  if(!_id || !status) return res.status(400).json({message: 'Missing _id or status'})
  if(status == "accepted") {
    const assignment = await Assignments.find({doctor: _id, status: "accepted"}).populate({path: 'patient', populate: {path: 'user', select: '-_id -password'}})
    if(!assignment) return res.status(404).json({message: 'Assignment not found'})
    res.status(200).json(assignment)
  }
  if(status == "pending") {
    const assignment = await Assignments.find({doctor: _id, status: "pending"}).populate({path: 'patient', populate: {path: 'user', select: '-_id -password'}})
    if(!assignment) return res.status(404).json({message: 'Assignment not found'})
    res.status(200).json(assignment)
  }
  if(status == "history") {
    const assignment = await Assignments.find({doctor: _id, status: {$in: ["rejected","disconnected"]}}).populate({path: 'patient', populate: {path: 'user', select: '-_id -password'}})
    if(!assignment) return res.status(404).json({message: 'Assignment not found'})
    res.status(200).json(assignment)
  }
}

export const getAssignmentAccept = async (_id) => {
  const assignment = await Assignments.findOne({patient: _id, status: "accepted"}).populate({path: 'patient', populate: {path: 'user', select: '-_id -password'}})
  if(!assignment) return null;
  return assignment;
}