const express = require('express')
const app = express()
const server  = require('http').Server(app)
const io = require('socket.io')(server)
const {v4:uuidV4} = require('uuid')
app.set('view engine','ejs')
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId+'user'+userId)
        socket.join(roomId)
        socket.broadcast.emit('user_connected',userId)
        socket.on('disconnect', () => {
            console.log('this is disconnecting')
            socket.broadcast.emit('user_disconnected',userId)
            socket.broadcast.emit('play_all')
          })
          socket.on('msg',msg=>{
              console.log('send all')
              console.log(msg)
              io.emit('send',msg)
              console.log('emitted')
          })
        
    })
    
})
server.listen(3000)