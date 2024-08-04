import React, {createContext, useState, useRef, useEffect} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
var server = process.env.REACT_APP_SERVER;
const socket = io(server);

function ContextProvider({children}, props)  {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState(null);
    const [callEnded, setCallEnded] = useState(null);
    const [callAccepted, setCallAccepted] = useState(null);
    const [name, setName] = useState('');
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    const [peerSocket, setPeerSocket] = useState('');
    //const [audioSrc, setAudioSrc] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then((stream) => {
            setStream(stream);
            if (myVideo.current)
                myVideo.current.srcObject = stream;

                const ctx = new AudioContext();
                const gainNode = ctx.createGain();
                const audioDest = ctx.createMediaStreamDestination();
                const source = ctx.createMediaStreamSource(stream);
    
                const biquadFilter = ctx.createBiquadFilter();
                biquadFilter.type = 'lowshelf';
                biquadFilter.frequency.value = 1000;
                biquadFilter.gain.value = 0.5;
                source.connect(biquadFilter);
                biquadFilter.connect(ctx.destination);
                /*gainNode.connect(audioDest);
                gainNode.gain.value = 0.15;   
                source.connect(gainNode);
                
                const audio = new Audio();
                audio.controls = true;
                audio.autoplay = true;
                audio.srcObject = audioDest.stream;
                audio.play();
                setAudioSrc(audio);*/
        });

        socket.on('me', (userId) => {
            setMe(userId);
            socket.emit('join', id, userId);
        });

        socket.on('enter-session', peerId => {
            setPeerSocket(peerId);
        });

        socket.on('callUser', ({from, name: callerName, signal}) => {
            setCall({isReceivedCall: true, from, name: callerName, signal});
        });
    }, []);

    function callUser(id) {
        if(id == '') {
            return;
        }

        var peer = new Peer({initiator: true, trickle: false, stream});
        peer.on('signal', (data) => {
            socket.emit('callUser', {userToCall: id, signalData: data, from: me, name})
        });
        peer.on('stream', (stream) => {
            if(userVideo.current)
                userVideo.current.srcObject = stream;
        });
        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
        connectionRef.current = peer;
    }

    function answerCall() {
        if (call == null) {
            return;
        }
        
        setCallAccepted(true);
        var peer = new Peer({initiator: false, trickle: false, stream});
        peer.on('signal', (data) => {
            socket.emit('answerCall', {signal: data, to: call.from});
        });
        peer.on('stream', (stream) => {
            if(userVideo.current)
                userVideo.current.srcObject = stream;
        });
        peer.signal(call.signal);
        connectionRef.current = peer;
    }

    function leaveCall() {
        if(call == null) {
            return;
        }

        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return(
        <SocketContext.Provider value={{ socket, id, call, callAccepted, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall}}>
            {children}
        </SocketContext.Provider>
    )
};

export {ContextProvider, SocketContext};