import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Checklogin } from "./Checklogin";

const Viewchats = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const divRef = useRef(null);
    var server = process.env.REACT_APP_SERVER;
    var client = process.env.REACT_APP_CLIENT;

    useEffect(() => {
        reload();
        setTimeout(() => {reload()}, 2000);
    });

    function reload() {
        var url = new URLSearchParams(window.location.search);

        try {
            axios.get(`${server}/viewchats`, { withCredentials: true }).then(res => {
                if (!res.data.status) {
                    toast.error(res.data.msg, {position: "bottom-left"});
                    navigate('/');       
                }
                else {
                    get(res.data.msg);
                }
            });
        } 
        catch (error) {
            console.log(error);
        }
    }  

    function get(data) {
        if(data == null) 
            return;
  
        divRef.current.innerHTML = ""; //clears content
        Object.entries(data).forEach(([key, value]) => {
            var node = document.createElement("div");
            node.innerHTML = `<span>${value.other}</span><a target=_blank href=${client}/chat?tutor=${value.tutor}&student=${value.student}>View</a>`;
            divRef.current.appendChild(node); //add chat link 
        });
    }

  return (
    <div>
        <Checklogin/>
        {/*<button id="rld" onClick={reload}>Check Messages</button>*/}
        <div id="contacts" ref={divRef}></div>
        <ToastContainer />
    </div>
  );
};

export default Viewchats;