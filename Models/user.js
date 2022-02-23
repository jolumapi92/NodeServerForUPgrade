const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { Message, messageSchema }= require('./entryMessage.js'); 

const UserSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    password: String,
    profileURL: String,
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    teacher:  {
        type: Boolean,
        default: false
    },
    messages: [messageSchema]
}, {
    timestamps: true,
    versionKey: false
})

UserSchema.static('hash', async function(user, password) {
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash( password, salt );
    user.password = hash;
    return user;
})

UserSchema.static('verify', async function(user, password) {
    const verified = await bcrypt.compare( password, user.password );
    return verified;
})

const User = mongoose.model( 'User', UserSchema );
module.exports = {UserSchema, User};