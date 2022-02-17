const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, { 
    cors: {
        origin: '*',
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.emit("jwt", {notification:"Identify yourself"});
    socket.on('auth', (e)=> {
        if(e){
            const verified = jwt.verify(e, process.env.SECRET);
            if(!verified){
                socket.disconnect()
                console.log("Disconnected")
            } else {
                console.log("User Authenticated", verified)
            }
        }
    })
});
  
server.listen(3000, () => {
    console.log('listening on *:3000');
});