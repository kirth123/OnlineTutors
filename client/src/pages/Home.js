import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Checklogin } from "./Checklogin";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [inputValue, setInputValue] = useState({search: ""});
  const { search } = inputValue;
  const divRef = useRef(null);
  var server = process.env.REACT_APP_SERVER;
  var client = process.env.REACT_APP_CLIENT;

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

  function format(data) {
    divRef.current.innerHTML = ""; //clears content
    Object.entries(data).forEach(([key, value]) => {
      var name = value.name;
      var desc = value.desc;
      var subject = value.subject
      var link = `${client}/chat?tutor=${value.tutor}&student=${value.student}`;
      var linktxt = `<a href=${link} target=_blank class=link>Contact</a>`;
      var node = document.createElement("div");
      node.innerHTML = `<p class=name>${name}</p><p class=sub>${subject}</p><p class=desc>${desc}</p>${linktxt}`;
      divRef.current.appendChild(node); //add tutor info to div
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      if (data.status) {
        format(data.msg);
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
      search: ""
    });
  };

  function logout() {
    removeCookie('token');
    window.location = '/login';
  }

  return (
    <div>
      <Checklogin/>
      <ul>
        <li><a target="_blank" href="/profile">Profile</a></li>
        <li><a target="_blank" href="/viewchats">Chats</a></li>
        <li><a onClick={logout}>Logout</a></li>
      </ul>
      <form className="searchbar" onSubmit={handleSubmit}>
        <input required 
          type="text" 
          name="search" 
          value={search}
          placeholder="Look for tutor" 
          onChange={handleOnChange}/>
        <button type="submit">Search</button>
      </form>
      <div className="list" ref={divRef}></div>
      <ToastContainer />
    </div>
  );
};

export default Home;