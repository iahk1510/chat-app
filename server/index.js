const express = require("express");
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;
const router = require('./router');

const {addUser, removeUser, getUser, getUserInRoom} = require ('./users');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

io.on('connect', (socket) => {
    console.log('we have a new connection!!!');
    socket.on('join', ({name, room}) => {
        console.log(name, room);
    });
    socket.on('disconnect', () => {
        console.log('User has left');
    });
    
});

app.use(router);
server.listen(PORT, () => {console.log(`server is running on port ${PORT}`)});