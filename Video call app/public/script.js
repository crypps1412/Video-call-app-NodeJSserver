document.getElementById('roomName').innerHTML = ROOM_NAME;

const socket = io('/');
const peer = new Peer(undefined, {
    host: '/',
    port: '8081',
    path: '/video-call'
});
const peers = {};

peer.on('open', userId => {
    socket.emit('join-room', ROOM_ID, userId, MY_NAME);
});


const videoGrid = document.getElementById('video-grid');
const myVideoObj = new VideoObject(MY_NAME);
myVideoObj.video.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addStream(myVideoObj, stream); // Show your own video cam

    socket.on('users-info', oldUsers => {
        peer.on('call', call => {
            call.answer(stream);
            const oldUserId = call.peer;
            const oldUserName = oldUsers.find(obj => { if (obj.id === oldUserId) return true; }).name;
            setupCall(call, oldUserName);
            peers[call.peer] = call;
        });

        socket.emit('ready-to-stream');
    });

    socket.on('new-user', (userId, userName) => {
        const call = peer.call(userId, stream); // Send your own stream
        setupCall(call, userName);
        peers[userId] = call;
    });

    socket.on('user-out', userId => {
        if (peers[userId]) peers[userId].close();
    });

    socket.emit('users-info');
})


function VideoObject(title) {
    this.container = document.createElement('div');
    this.video = this.container.appendChild(document.createElement('video'));
    this.video.playsInline = true;
    this.content = this.container.appendChild(document.createElement('div'))
    this.title = this.content.appendChild(document.createElement('p'));
    this.title.innerHTML = title;

    this.container.classList.add('container');
    this.content.classList.add('content');

    this.source = stream => this.video.srcObject = stream;
}


function setupCall(call, name) {
    const videoObject = new VideoObject(name);
    call.on('stream', stream => { // Wait for the new user's stream
        addStream(videoObject, stream);
    });
    call.on('close', () => {
        removeStream(videoObject);
    });
}

function addStream(videoObj, stream) {
    videoObj.source(stream);
    videoObj.video.addEventListener('loadedmetadata', () => {
        videoObj.video.play();
    });
    videoGrid.append(videoObj.container);
}

function removeStream(videoObj) {
    videoObj.container.remove();
}