const { Message } = require('../Models/entryMessage.js');
const mongoose = require('mongoose');
const { User } = require('../Models/user.js');
const jwt = require('jsonwebtoken');



module.exports.savingMessages = async (payload) => {
    console.log(payload)
    if(!payload.user) {
        console.log("Token invalid");
    } else {
        try {
            const verified = jwt.verify(payload.user, process.env.SECRET)
            const query = await User.find( { _id: verified.user } )
            if(query === []) {
                console.log("User not found")
            } else {
                let user = query[0];
                if(payload.messages.length > user.messages.length) {
                    let newCollection = [];
                    for( message of payload.messages) {
                        let instance = new Message({ _id: new mongoose.Types.ObjectId(), message: message.message, author: verified.user })
                        newCollection.push(instance);
                    }
                    await User.findOneAndUpdate({ _id: verified.user }, { messages: newCollection}, { new: true } );
                    console.log("The user has been updated")
                } else {
                    console.log("user up to date")
                }
            }
        } catch (error) {
            console.log("Not Auth 2");
        }
    }
}


