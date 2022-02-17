const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
//Web Socket Functions for Emit
const socketActions = require('./services/socket.js')

const PORT = process.env.PORT || 8000;
//const {  PORT, server}  = require('./services/socket.js')
//Web Socket Configuration
app.use(cors({ origin: true, credentials: true }));
app.use( bodyParser.json({type: "json"}) );

mongoose.connect('mongodb+srv://jolumapi92:'+ process.env.TOP + '@cluster0.ukcjm.mongodb.net/UPgrade?retryWrites=true&w=majority', function(error) {
    if(error) {
        console.log(error)
    } else {
        console.log("Success")
    }
})

const mainRouter = require('./Router/main.js')
app.use(mainRouter);
const server = http.createServer(app);
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
    socket.emit('messages');
    socket.on('bulk', socketActions.savingMessages)
});

server.listen(PORT, () => {
    console.log('listening on port: ' + PORT);
});

