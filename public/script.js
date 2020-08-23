const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')
myVideo.id = "selfvideo"
const filter = document.querySelector('#filter')
myVideo.muted = true
const peers = {}
let peerid = '';
let callerIds  = [];
let index = 0;
let user_ips = []
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  filter.addEventListener('change', (event) => {
    currentFilter = event.target.value
    myVideo.style.filter = currentFilter
    //SendFilter(currentFilter)
    // myPeer.send(currentFilter)
    socket.emit('changeFilter',ROOM_ID,currentFilter,peerid)
    event.preventDefault
  })

  socket.on('SendToReicever',(callerId)=>{
    console.log(callerId + ' calling you');
    callerIds.push(callerId)
  })
  
  myPeer.on('call', call => {
    console.log("me firts");
    call.answer(stream)
    const video = document.createElement('video')
    video.addEventListener('click', () => {
      console.log("You clicked mute");
      video.volume == 1 ? video.volume = 0 : video.volume = 1;
  
    })
    video.className = callerIds[index++]

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  
  myPeer.on('data', function (data) {
    console.log("hahaha");
    let decodedData = new TextDecoder('utf-8').decode(data)
    let peervideo = document.querySelectorAll('.frvideo')
    peervideo.style.filter = decodedData
})

  socket.on('user-connected', (userId) => {

    // console.log(user_ip);
    // if(user_ips.toString().includes(user_ip)) return alert('User exists in a group')
    // user_ips.push(user_ip)
    console.log("hey");
    // let allowJoining = confirm(`Allow ${userId} joins this calling ? `)
    // if(allowJoining)
    connectToNewUser(userId, stream)
    generatorDiv(userId,'join',isLight)
    // else socket.emit('NotAllowing',ROOM_ID)
  })
})

socket.on('user-disconnected', userId => {
  console.log("left");
  generatorDiv(userId,'unjoined',isLight)
  document.querySelector(`.${userId}`).remove()
  if (peers[userId]) peers[userId].close()
})

socket.on('Backanswer',()=>{
  console.log("You are not allowed to join this calling");
})

socket.on('Backfilter',(data,peerid)=>{
  console.log(data);
    // let decodedData = new TextDecoder('utf-8').decode(data)
    let frvideo = document.querySelector(`.${peerid}`)
    // frvideos.forEach((frvideo) =>{

       frvideo.style.filter = data

    // })
})

myPeer.on('open', id => {
  peerid = id;
  document.querySelector("#peer").textContent = 'Your peerID - ' + id
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  video.className = userId
  video.addEventListener('click', () => {
    console.log("You clicked mute");
    video.volume == 1 ? video.volume = 0 : video.volume = 1;

  })

  socket.emit('SendCaller',peerid,ROOM_ID)

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}