const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
//Web Socket Configuration
const { PORT, server  }  = require('./services/socket.js')
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