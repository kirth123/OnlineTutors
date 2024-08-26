import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });
  const { username, password } = inputValue;
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
    navigate('/'); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${server}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      if (data.status)
        handleSuccess(data.msg);
      else
        handleError(data.msg);
    } 
    catch (error) {
      console.log(error);
    }

    setInputValue({
      ...inputValue,
      username: "",
      password: ""
    });
  };

  return (
    <div className="form_container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
          {client}
        </div>
        <div>
          {server}
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
        <button type="submit" data-testid="submission_link">Submit</button>
        <span>
          Don't have an account? <Link to={"/signup"} data-testid="signup_link">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;