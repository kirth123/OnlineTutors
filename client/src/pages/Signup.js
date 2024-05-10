import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: ""
  });
  const { email, password, username } = inputValue;
  var server = process.env.REACT_APP_SERVER;
  
  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  function handleError(err) {
    toast.error(err, {position: "bottom-left",});
  }

  function handleSuccess(msg) {
    toast.success(msg, {position: "bottom-left",});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/signup`,
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
      email: "",
      username: "",
      password: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
        <span>Already have an account? <Link target="_blank" to={"/login"}>Login</Link></span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;