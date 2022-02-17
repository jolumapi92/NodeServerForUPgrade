const express = require('express');
const app = express();
const mongoDB = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./services/socket.js')

//Web Socket Configuration


const PORT = process.env.PORT || 8000;
require('dotenv').config();

app.use(cors({ origin: true, credentials: true }));
app.use( bodyParser.json({type: "json"}) );


mongoDB.connect('mongodb+srv://jolumapi92:'+ process.env.TOP + '@cluster0.ukcjm.mongodb.net/UPgrade?retryWrites=true&w=majority', (err, db) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to the data base");
        mongoose.connect('mongodb+srv://jolumapi92:'+ process.env.TOP + '@cluster0.ukcjm.mongodb.net/UPgrade?retryWrites=true&w=majority', function(error) {
            if(error) {
                console.log(error)
            } else {
                console.log("Success")
            }
        })
    }
})

const mainRouter = require('./Router/main.js')
app.use(mainRouter);

app.listen( PORT, function() {
    console.log(" Your app is up and running on port:" + PORT);
})


if(process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'))
}