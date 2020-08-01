

const socket = io('/')
const videoGrid = document.getElementById("chat__sidebar")

const peer = new Peer(undefined)
const video = document.createElement('video')
const call = peer.call()

video.muted = true
const peers = {}
const user = []
peer.on('open', id =>{
    socket.emit('join-room',ROOM_ID,id)
    user[0] = id
})


    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    }).then(stream=>{
        
        
            console.log(user[0])
        addVideoStream(video,stream,ROOM_ID)
        peer.on('call',call=>{
            call.answer(stream)
            const myvideo = document.createElement('video')
            call.on('stream',uservideoStream=>{
                addVideoStream(myvideo,uservideoStream)
            })
        })
        socket.on('user_connected',userId =>{
            
            connectToNewUser(userId,stream)
            console.log('Connecting.....')
        })
        
        
        
    })
    socket.on('send',msg=>{
        console.log('sendALL')
        const m = document.createElement('p')
        m.innerHTML = msg
        console.log(m.value)
        document.getElementById('msg1').appendChild(m)
    })
socket.on('user_disconnected',userId=>{
    console.log(user)
    
        if (peers[userId]) peers[userId].close()
        console.log('removing.....')
        document.getElementById(userId).remove()
        
   
})
socket.on('play_all',()=>{
    video.play()
})



function connectToNewUser(userId,stream){
    const call = peer.call(userId,stream)
   const video = document.createElement('video')
    call.on('stream',uservideoStream=>{
        addVideoStream(video,uservideoStream,userId)
    })
    call.on('close',()=>{
        
        console.log('removing.....')
        video.remove()
    })
    peers[userId] = call
}

document.getElementById("msg").addEventListener("submit", (e)=>{
    console.log('this is getting')
    e.preventDefault()
    const msg = document.querySelector('input').value
    console.log(msg)
    socket.emit('msg',msg)
});

function addVideoStream(video,stream,userId){
    video.srcObject = stream
    video.setAttribute('id',userId)
    video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    
    document.getElementById("chat__sidebar").append(video);
}