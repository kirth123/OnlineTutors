import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checklogin = () => {
    var server = process.env.REACT_APP_SERVER;
    const navigate = useNavigate();

    useEffect(() => {
        try {
          axios.get(`${server}/login`,
            { withCredentials: true })
          .then(res => {
            if (!res.data.status) {
              navigate('/login'); 
            }
          });
        } 
        catch (error) {
          console.log(error);
        }
      }, []);
  
    return (<></>);
};
  
export {Checklogin};