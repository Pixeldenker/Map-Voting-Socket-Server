const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

io.on('connection', socket => {

  socket.on('room', room => {
    // Start new session (room) 
    socket.join(room)
  })

  socket.on('checkRoom', code => {
    let senderId = 'id-' + code

    if (io.sockets.adapter.rooms[code] && io.sockets.adapter.rooms[code].length === 1) {
      // A user is in the room. The user can join the room
      socket.join(code)
      socket.emit(senderId, 200)
      socket.to(code).emit('room-complete', 200)
    } else if (io.sockets.adapter.rooms[code] && io.sockets.adapter.rooms[code].length === 2) {
      // Two users are in the room. No new user can join a room
      socket.emit(senderId, 'This room is full')
    } else {
      // Room does not exists
      socket.emit(senderId, 'This room does not exists')
    }
  })

  socket.on('user-choose-map', data => {
    socket.to(data.code).emit('choosen-map', data)
  })

})

server.listen(port, () => console.log(`Listening on port ${port}`))