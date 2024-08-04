import { SocketContext } from "./Context";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Videoplayer() {
    const navigate = useNavigate();
    const { callAccepted,  userVideo, callEnded, stream } = useContext(SocketContext);

    return (
        <div>
            { /*    ensures your video stream is enabled, call hasn't ended, 
                    and you accepted call before enabling other user's video    */
                stream && callAccepted && !callEnded && ( 
                    <>
                        <video playsInline ref={userVideo} autoPlay></video>
                    </>
                )
            }
        </div>
    )
}

export default Videoplayer;