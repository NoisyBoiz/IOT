import Chats from '../models/chats.js'
import Users from '../models/users.js'
import { chatWithGPT } from '../utils/chatWithGPT.js'
import { CustomError } from "../utils/CustomError.js"
import {formatStr} from '../utils/formatESP.js'

export const postChat = async (req, res) => {
  const {userId, message} = req.body
  try {
    const response = await chatWithGPT(message)
    const data = {
      userId,
      message,
      response
    }
    Chats.create(data)
    res.status(200).json({ data: data })
  } 
  catch (error) {
    res.status(500).json({ error: error })
  }
}

export const getChat = async (req, res) => {
  try {
    const chat = await Chats.find()
    res.status(200).json({chat})
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const getChatByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId
    if (!userId) next(new CustomError('Not Found', 404))

    const user = await Users.findById(userId)
    if (!user) next(new CustomError('Not Found', 404))

    const chats = await Chats.find({ userId: userId })
    res.status(200).json({"chat": chats, "len": chats.length})
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const getChatESP = async (req, res, next) => {
    try {
        const userId = req.params.userId
        if (!userId) next(new CustomError('Not Found', 404))

        const user = await Users.findById(userId)
        if (!user) next(new CustomError('Not Found', 404))

        const idx = req.params.idx

        const chats = await Chats.find({userId: userId})
        const chatLen = chats.length
        const chat = (idx==-1||idx>=chatLen)?chats[chatLen-1]:chats[idx]

        const message = formatStr(chat.message)
        const response = formatStr(chat.response)
        const mLine = message.split('\n').length
        const rLine = response.split('\n').length
        const data = {
            "message": message,
            "response": response,
            "mLine": mLine,
            "rLine": rLine,
            "len": chatLen
        }
        res.status(200).json({data})
    } 
    catch (error) {
        res.status(500).json({error: error})
    }
}
  