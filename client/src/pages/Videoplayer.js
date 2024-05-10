import { SocketContext } from "./Context";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Videoplayer() {
    const navigate = useNavigate();
    const { callAccepted,  userVideo, callEnded, stream } = useContext(SocketContext);
    const audioContainer = useRef();

    /*useEffect(() => {
        if(audioContainer.current) 
            audioContainer.current.appendChild(audioSrc);
    }, [audioContainer, audioSrc]);*/

    return (
        <div>
            { //ensures your video stream is enabled b4 enabling other user's video
                stream && callAccepted && !callEnded && ( 
                    <>
                        <video playsInline ref={userVideo} autoPlay></video>
                       {/* <div ref={audioContainer}></div> */}
                    </>
                )
            }
        </div>
    )
}

export default Videoplayer;