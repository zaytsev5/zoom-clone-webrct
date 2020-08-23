const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

let user_ips = [];

let PORT =  process.env.PORT || 5000
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // if(user_ips.includes(req.ip))
  //   return res.redirect(`/`)
  // user_ips.push(req.ip)
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  // if(user_ips.includes(req.ip))
  //   return  res.redirect(`/${uuidV4()}`)

   console.log(req.ip);
  // user_ips.push(req.ip)
  res.render('room', { roomId: req.params.room })
})
///

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    //socket.to(roomId).broadcast.emit('send-ips',user_ip)

    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })

    socket.on('SendCaller', (peerid,roomId) =>{
      socket.to(roomId).broadcast.emit('SendToReicever',peerid)
    })

    // socket.on('NotAllowing', (roomId) =>{
    //   socket.to(roomId).broadcast.emit('Backanswer')
    // })

    socket.on('changeFilter', (roomId,curentFilter, peerid) =>{
      socket.to(roomId).broadcast.emit('Backfilter',curentFilter,peerid)
    })
  })
})

server.listen(PORT,()=>{
  console.log("Server started on port 3002");
})
