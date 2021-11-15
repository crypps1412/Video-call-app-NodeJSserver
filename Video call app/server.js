/* SSL certificate */
const fs = require('fs');
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

/* HTTPS Server */
const express = require('express');
const app = express();
const port = 8080;
const https = require('https');
const server = https.createServer(options, app);

/* Socket and Id */
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

/* Peer Server */
const { PeerServer } = require('peer');
const peerServer = PeerServer({
    host: '/',
    port: '8081',
    path: '/video-call',
    ssl: options
});

/* Constant */
function room(id, name, pass) {
    this.id = id;
    this.name = name;
    this.pass = pass;
    this.users = [];
}
const rooms = [];

function user(id, name, room) {
    this.id = id;
    this.name = name;
}

/* Handle client request */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { // Generate login page
    res.render('login', { rooms: rooms.map(obj => obj.name) });
})

app.post('/create-room', (req, res) => { // Send user to a new room
    const roomName = req.body.room;
    const roomPass = req.body.pass;

    if (!rooms.length || rooms.map(obj => obj.name).indexOf(roomName) === -1) {
        const roomId = uuidV4();
        rooms.push(new room(roomId, roomName, roomPass));
        res.json({
            stt: 'Ok',
            id: roomId
        });
    } else res.json({ stt: 'Room you want to create has existed!' });
});

app.post('/join-room', (req, res) => { // Send user to a specific room by room id
    if (!rooms.length) {
        res.json({ stt: 'Wrong room name!' });
        return;
    }

    const roomName = req.body.room;
    const roomPass = req.body.pass;

    const roomIndex = rooms.map(obj => obj.name).indexOf(roomName);
    if (roomIndex === -1) res.json({ stt: 'Wrong room name!' });
    else if (roomPass === rooms[roomIndex].pass)
        res.json({
            stt: 'Ok',
            id: rooms[roomIndex].id
        });
    else res.json({ stt: 'Wrong room password!' });
});


/* After entering a room */
app.get('/:room/:user/:id', (req, res) => { // Enter the room by room id
    if (rooms.map(obj => obj.id).indexOf(req.params.id) != -1)
        res.render('room', {
            roomId: req.params.id,
            userName: req.params.user,
            roomName: req.params.room
        });
    else res.send("<script>alert('Room link is not valid!\\nReturn to login page!'); window.location.href = '/'; </script>");
});

io.on('connection', socket => { // Connect to other peers in the room
    socket.on('join-room', (roomId, userId, userName) => {
        socket.join(roomId);

        const roomIndex = rooms.map(obj => obj.id).indexOf(roomId);
        const userIndex = rooms[roomIndex].users.push(new user(userId, userName));

        socket.on('users-info', () => {
            socket.emit('users-info', rooms[roomIndex].users);
        });

        socket.on('ready-to-stream', () => {
            socket.broadcast.to(roomId).emit('new-user', userId, userName);
        });

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-out', userId);
            rooms[roomIndex].users.splice(userIndex - 1, 1);
            if (!rooms[roomIndex].users.length) rooms.splice(roomIndex, 1);
        });
    });
});


/* Server listening */
// server.listen(port, () => {
//     console.log('Listening on port: ' + port);
// })
