import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose, { set } from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'

import auth from './routers/auth.routers.js'
import user from './routers/users.routers.js'
import health from './routers/healths.routers.js'
import chat from './routers/chats.routers.js'

import { handlePostHealth } from './controllers/health.controllers.js'
import {getAssignmentAccept} from './controllers/user.controllers.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', auth)
app.use('/user', user)
app.use('/health', health)
app.use('/chat', chat)

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`)
    socket.emit('connection', null)

    // const inter = setInterval(() => {
    //     getAssignmentAccept("6749ef15b5d198a26849ddde").then((assignment) => {
    //         console.log(String(assignment.doctor))
    //         if(assignment) io.to(String(assignment.doctor)).emit("emergency", {fullname: assignment.patient.user.fullname, hr: 12, spo2: 12})
    //     })  
    // }, 500)

    const inter = setInterval(() => {
        io.to("6749ef15b5d198a26849ddde").emit("healths", {heartRate: Math.random() * 2 + 70, spo2: Math.random() * 2 + 90})
    }, 500)

    socket.on("sendHealths", async (data) =>{
        console.log(`📩 Healths received: ${data.id} ${data.hr} ${data.spo2}`)
        if(await handlePostHealth(data.id, data.hr, data.spo2)){
            io.to(data.id).emit("healths", {heartRate: data.hr, spo2: data.spo2})
        }

        if((data.hr > 120 || data.spo2 < 85) && (data.spo2 > 0 && data.hr > 0)){
            let assignment = await getAssignmentAccept(data.id)
            if(assignment) io.to(String(assignment.doctor)).emit("emergency", {fullname: assignment.patient.user.fullname, hr: data.hr, spo2: data.spo2})
        }
    })

    socket.on('listen', (_id) => {
        socket.join(_id)
        console.log(`✅ Doctor ${socket.id} joined room for patient: ${_id}`)
    })

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`)
        clearInterval(inter)
    })
})

const dbURI = "mongodb://localhost:27017/IOT"
mongoose.connect(dbURI).then(() => {
    console.log('✅ Successfully connected to MongoDB')
}).catch((error) => {
    console.error('❌ MongoDB connection error:', error.message)
})

httpServer.listen(process.env.PORT, () => {
    console.log('Server is running ...');
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message)
    httpServer.close(() => process.exit(1))
})

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error.message)
    httpServer.close(() => process.exit(1))
})
