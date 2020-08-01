const socket = io('/')
const videoGrid = document.getElementById("video-grid")

const peer = new Peer(undefined,{
    host:'/',
    port:'3001'
})
const myVideo = document.createElement('video')
myVideo.setAttribute('type','video/mp4')
myVideo.muted = true
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(myVideo,stream)
    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',uservideoStream=>{
            addVideoStream(video,uservideoStream)
        })
    })
    socket.on('user-connected',userId =>{
        connectToNewUser(userId,stream)
        console.log('Connecting.....')
    })
})
socket.on('user_connected',userId=>{
    console.log('userId')
})
peer.on('open', id =>{
    socket.emit('join-room',ROOM_ID,id)
})
function connectToNewUser(userId,stream){
    const call = peer.call(userId,stream)
    const video1 = document.createElement('video')
    call.on('stream',uservideoStream=>{
        addVideoStream(video1,uservideoStream)
    })
    call.on('close',()=>{
        video.remove()
    })
}



function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    
    document.getElementById("video-grid").append(video);
}