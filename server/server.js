const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {PORT, CLIENT} = process.env;
const fs = require('fs');
const https = require('https');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); 

const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.onlinetutorstoday.net/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.onlinetutorstoday.net/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/www.onlinetutorstoday.net/chain.pem', 'utf8')

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

//const server = require('http').createServer(app);
const server = https.createServer(credentials, app);
const cors = require("cors");
app.use(cors({
    origin: `${CLIENT}`,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    credentials: true
}));

const io = require("socket.io")(server, {
    cors: {
        origin: `${CLIENT}`,
        methods: ["GET", "POST", "PUT", "OPTIONS"]
    }
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on('join', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('enter-session', userId); //broadcast to everyone in room except sender

        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
        });

        socket.on("callUser", ({ userToCall, signalData, from, name }) => {            
            socket.to(roomId).emit("callUser", { signal: signalData, from, name });
        });
    
        socket.on("answerCall", (data) => {
            socket.to(roomId).emit("callAccepted", data.signal);
        });
    
        socket.on("draw", (data) => {
            socket.to(roomId).emit('ondraw', data);
        });
    
        socket.on('down', (data) => {
            socket.to(roomId).emit('ondown', data);
        });
    });
});

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const verifyRoute = require('./routes/verify');
const logoutRoute = require('./routes/logout');
const createApptRoute = require('./routes/createappt');
const sessionRoute = require('./routes/session');
const homeRoute = require('./routes/home');
const chatRoute = require('./routes/chat');
const viewChatsRoute = require('./routes/viewchats');

app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/verify', verifyRoute);
app.use('/logout', logoutRoute);
app.use('/createappt', createApptRoute);
app.use('/session', sessionRoute);
app.use('/', homeRoute);
app.use('/chat', chatRoute);
app.use('/viewchats', viewChatsRoute);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
