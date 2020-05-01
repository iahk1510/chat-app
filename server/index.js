const express = require("express");
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;
const router = require('./router');

const {addUser, removeUser, getUser, getUserInRoom} = require ('./users');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    //when a new account join room
    socket.on('join', ({name, room}, callback) => {
        //console.log(socket);
        //add newbie to member list
        const {error, user} = addUser({id:socket.id, name, room});
        if (error) return callback(err);
         // system send to people who has joined room
        socket.emit('message', {user:'admin', text:`${user.name}, welcome to the room ${user.room}`});
         // system send to all other members of the room about newbie (except newbie)
        socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined!`});
        // join user in a room (particually here's the newbie)
        socket.join(user.room);
        
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(user);
        io.to(user.room).emit('message', {user: user.name, text: message});
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User has left');
    });
    
});

app.use(router);
server.listen(PORT, () => {console.log(`server is running on port ${PORT}`)});