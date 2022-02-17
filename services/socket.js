const express = require('express');
const { app } = require('../server.js')
const jwt = require('jsonwebtoken');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


const PORT = process.env.PORT || 8000;

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
  
server.listen(PORT, () => {
    console.log('listening on port: ' + PORT);
});