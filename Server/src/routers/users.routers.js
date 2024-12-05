import express from 'express'
import {myInfo, myDoctor, getDoctorById, getPatientById, listDoctor, updateProfile, requestAssignment, responseAssignment, getAssignment} from '../controllers/user.controllers.js'

const router = express.Router()

router.get('/myInfo/:_id', myInfo)
router.get('/myDoctor/:_id', myDoctor)
router.get('/listDoctor', listDoctor)
router.get('/getDoctorById/:_id/:doctor_id', getDoctorById)
router.get('/getPatientById/:_id', getPatientById)
router.put('/updateProfile', updateProfile)
router.post('/requestAssignment', requestAssignment)
router.post('/responseAssignment', responseAssignment)
router.get('/getAssignment/:_id/:status', getAssignment)

export default router
