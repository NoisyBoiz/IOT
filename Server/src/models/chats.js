import mongoose from 'mongoose'

const ChatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  message: String,
  response: String,
  Date: { type: Date, default: Date.now }
})

const Chats = mongoose.model('chats', ChatsSchema)

export default Chats
