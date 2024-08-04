import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Checklogin } from "./Checklogin";

const Createappt = () => {
  var server = process.env.REACT_APP_SERVER;
  var client = process.env.REACT_APP_CLIENT;

  var url = new URLSearchParams(window.location.search);
  const [inputValue, setInputValue] = useState({
    student: url.get("student"),
    tutor: url.get("tutor"),
    datetime: "",
    hrs: "",
    min: ""
  });
  const { student, datetime, hrs, min } = inputValue;
  
  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue({
        ...inputValue,
        [name]: value
    });  
  }

  function handleError (err) {
    toast.error(err, {position: "bottom-left"});
    if(err == "Not logged in") 
      setTimeout(() => {window.location = `${client}`}, 1500);
  } 

  function handleSuccess(msg) {
    toast.success(msg, {position: "bottom-left"});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/createappt`,
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
      hrs: "",
      min: "",
      datetime: "",
    });
  };

  return (
    <div className="form_container">
      <Checklogin/>
      <h2>Set Up Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="datetime">What time do you want to meet?</label>
          <input
            required
            type="datetime-local"
            name="datetime"
            value={datetime}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label>For how many hours?</label>
          <input
            required
            id='hrinput'
            type="number"
            name="hrs"
            value={hrs}
            min='0'
            max='3'
            onChange={handleOnChange}
          />
          <label>For how many minutes?</label>
          <input
            required
            id='mininput'
            type="number"
            name="min"
            value={min}
            min='0'
            max='59'
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Createappt;