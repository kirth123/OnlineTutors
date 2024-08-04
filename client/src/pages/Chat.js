import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Checklogin } from "./Checklogin";

const Chat = () => {
  var server = process.env.REACT_APP_SERVER;
  var client = process.env.REACT_APP_CLIENT;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  var url = new URLSearchParams(window.location.search);
  const [inputValue, setInputValue] = useState({msg: "", student: url.get('student'), tutor: url.get('tutor')});
  const { msg } = inputValue;
  const divRef = useRef(null);
  const [chatData, setChatData] = useState([]);
  var url = new URLSearchParams(window.location.search);
  var tutor = url.get('tutor');
  var student = url.get('student');

  useEffect(() => {
    try {
      axios.get(`${server}/chat?tutor=${url.get('tutor')}&student=${url.get('student')}`,
        { withCredentials: true })
      .then(res => {
        if (!res.data.status) {
          toast.error(res.data.msg, {position: "bottom-left"});
          setTimeout(() => {navigate('/')}, 1500);          
        }
        else {
          get(res.data.msg);
        }
      });
    } 
    catch (error) {
      console.log(error);
    }
  });
  
  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  function handleError(err) {
    toast.error(err, {position: "bottom-left"});
  } 

  function handleSuccess(msg) {
    toast.success(msg, {position: "bottom-left"});
  }

  function get(data) {
    if(data == null) 
      return;
    
    divRef.current.innerHTML = ""; //clears content
    Object.entries(data).forEach(([key, value]) => {
      setChatData(prevState => [...prevState, value]);
      var node = document.createElement("div");
      node.classList.add(value.type);
      node.innerHTML = `${value.msg}`;
      divRef.current.appendChild(node); //add message to page
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/chat`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      if (data.status) {
        handleSuccess(data.msg);
      }
      else {
        handleError(data.msg);
      }
    } 
    catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      msg: ""
    });
  };

  return (
    <div>
      <Checklogin/>
      <a id="sch" target="_blank" className="link"
      href={`${client}/createappt?tutor=${tutor}&student=${student}`}>
        Schedule Appointment</a>
      <div id="chathistory" ref={divRef}></div>
      <form className="searchbar" id="sendmsg" onSubmit={handleSubmit}>
        <input required type="text" name="msg" value={msg} placeholder="Enter message" onChange={handleOnChange}/>
        <button type="submit">Send</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Chat;