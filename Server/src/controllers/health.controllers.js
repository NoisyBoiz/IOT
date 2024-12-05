import Healths from '../models/healths.js'
import Users from '../models/users.js'
import { CustomError } from '../utils/CustomError.js'

export const getHealth = async (req, res) => {
  try {
    const _id = req.params._id
    const date = req.params.date

    if (!_id) return res.status(400).json({message: 'Missing _id'})

    const user = await Users.findById(_id)
    if (!user) return res.status(404).json({message: 'User not found'})

    let now = new Date()
    if(date) now = new Date(date)

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    console.log(start, end)

    const health = await Healths.find({patient: _id, createdAt: {$gte: start, $lt: end}}).sort({createdAt: 1})
    if (!health) return res.status(404).json({message: 'Health not found'})
    res.status(200).json({ health })
  } 
  catch (err) {
    console.error(err)
    res.status(400).json({ error: err })
  }
}

export const postHealth = async (req, res) => {
  try {
    const _id = req.body._id
    if (!_id) next(new CustomError('Missing _id', 400))

    const user = await Users.findById(_id)
    if (!user) next(new CustomError('User not found', 404))
   
    const health = await Healths.create(req.body)
    res.status(200).json({health})
  } catch (error) {
    res.status(400).json({ error })
  }
}

export const handlePostHealth = async (_id, heartrate, spo2) => {
  try {
    if(!_id || !heartrate || !spo2) return false
    if(heartrate <= 0 || spo2 <= 0 || spo2 > 100) return false
    const patient = await Users.findById(_id)
    if(!patient) return false
    await Healths.create({patient: _id, heartrate, spo2})
    return true
  }   
  catch (error) {
    console.error(error)
    return false
  }
}
