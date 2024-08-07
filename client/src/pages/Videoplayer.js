import {SocketContext} from "./Context";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";

function Videoplayer() {
    const { callAccepted, userVideo, callEnded, stream } = useContext(SocketContext);

    return (
        <div>
            { /* ensures your video stream is enabled and call is accepted 
                and hasn't ended yet before enabling other user's video only */
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