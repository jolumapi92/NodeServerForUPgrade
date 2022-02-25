const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
const {User} = require('./Models/user.js');

//Cloudinary Service
const cloudinary = require('cloudinary').v2;
console.log(cloudinary.config().cloud_name);
const fs = require("fs");
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
    socket.on('auth', async (e)=> {
        if(e !== null) {
            try {
                const verified = jwt.verify(e, process.env.SECRET);
                if(!verified){
                    socket.emit("thief", "You have been terminated")
                    socket.disconnect()
                    console.log("Disconnected")
                } else {
                    let user = await User.findById(verified.user);
                    socket.emit("username", user.name);
                    socket.emit("username-credentials", user.name);
                    socket.emit('fetch-messages', { messages: user.messages } )
                    console.log("User Authenticated", verified)
                    if(user.profileURL) {
                        socket.emit('url-for-profile-image', {url: user.profileURL, id:user._id});
                    }
                }
            } catch (error) {
                console.log("You have been terminated")
                socket.emit("thief", "You have been terminated")
                socket.disconnect();
            }
        } else {
            socket.emit("invalid", { notification: "Invalid token" })
        }
    })
    socket.on('bulk', socketActions.savingMessages)
    socket.on("photo", async (payload) => {
        console.log(payload, "Triggered the upload")
        const { body, fileName, token } = payload;
        const str = Buffer.from(body);
        //Writting the file from the buffer sent by the user
        fs.writeFile('./images/'+ fileName, str, { encoding: 'base64' }, (err) => {
            if(err) {
                console.log(err)
            } else {
                console.log("Successfully written the file....")
            }
        })
        // Authenticating the user
        try {
            const verified = jwt.verify(token, process.env.SECRET)
            const query = await User.find( { _id: verified.user } )
            if(query === []) {
                console.log("User not found")
            } else {
                if(payload) {
                    cloudinary.uploader.upload(__dirname + '/images/' + fileName, {
                        resource_type: "image"
                    }).then( res => {
                        console.log(JSON.stringify(res))
                        console.log("Successfully saved the resource", res.secure_url);
                        socket.emit('url-for-profile-image', {url: res.secure_url, id: verified.user});
                        User.findOneAndUpdate({ _id: verified.user }, { profileURL: res.secure_url}, { new: true } ).then( response => { console.log(response) });
                    }).catch(e => {
                        console.log(e, JSON.stringify(e, null, 2))
                    })
                } else {
                    console.log("No image to upload to cloudinary")
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
});

server.listen(PORT, () => {
    console.log('listening on port: ' + PORT);
});

