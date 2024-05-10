const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        required: true
    },
    verify_token: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: false
    }
});

const sessionschema = new mongoose.Schema({
    appt_time: {
        type: String,
        required: true
    },
    tutor: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    appt_id: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    }
});

const chatsschema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    tutor: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    }, 
    fromUser: {
        type: String,
        required: true
    },
    toUser: {
        type: String,
        required: true
    }
});

const users = mongoose.model("users", userschema);
const sessions = mongoose.model("sessions", sessionschema);
const chats = mongoose.model('chats', chatsschema);
module.exports = {users, sessions, chats};