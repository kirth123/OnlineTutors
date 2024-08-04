import { SocketContext } from "./Context";
import React, { useContext, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Options() {
    const navigate = useNavigate();
    const { socket, me, call, leaveCall, callUser, answerCall, id, peerSocket } = useContext(SocketContext);
    var server = process.env.REACT_APP_SERVER;
    const [flag, setFlag] = useState(true);

    useEffect(() => {
      try {
        axios.get(`${server}/session?id=${id}`,
          { withCredentials: true })
        .then(res => {
          if (!res.data.status) {
            toast.error(res.data.msg, {position: "bottom-left"});
            setTimeout(() => {navigate('/')}, 1500); 
          }
        });
      } 
      catch (error) {
        console.log(error);
      }  
    });

    function endCall() {
      setFlag(false);
      leaveCall();
    }

    return (
        <>
            {call == null && flag? (<button id="callbtn" onClick={callUser(peerSocket)}>Call</button>): 
                (<button id="answerbtn" onClick={answerCall}>Answer</button>)}
            <button id="hangupbtn" onClick={endCall}>Hang Up</button>
            <ToastContainer/>   
        </>
    );
}

export default Options;