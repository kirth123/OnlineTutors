import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Checklogin } from "./Checklogin";

const Profile = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        update: true,
        name: "",
        desc: "",
        subject: ""
    });
    const { name, desc, subject } = inputValue;
    const [cookies, removeCookie] = useCookies([]);
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
        name: "",
        desc: "",
        subject: "",
        });
    };

    return (
        <div className="form_container">
            <Checklogin/>
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="name">Full Name</label>
                <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Enter your full name"
                    onChange={handleOnChange}
                />
                </div>
                <div>
                <label htmlFor="desc">Tell us about yourself</label>
                <input
                    required
                    type="text"
                    name="desc"
                    value={desc}
                    placeholder="max 50 words"
                    onChange={handleOnChange}
                />
                </div>
                <div>
                <label htmlFor="subject">Subject</label>
                <input
                    required
                    type="text"
                    name="subject"
                    value={subject}
                    placeholder="If you're a student, say student"
                    onChange={handleOnChange}
                />
                </div>
                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Profile;