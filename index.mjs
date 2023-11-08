import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 4000
const app = express()
app.use(express.static(path.join(__dirname, "public")))
const expressServer = app.listen(PORT,() => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : 
        ["http://localhost:4000", "http://127.0.0.1:4000"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // upon connection - user only
    socket.emit('message', "online")

    // listening for a message event
    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`)
    })

    // listen for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })

    // when user disconnects - admin only
    socket.on('disconnect', () =>{
        console.log(`User ${socket.id} disconnected`)
    })
})

