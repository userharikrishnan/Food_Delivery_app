import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const checkAuth = (Component) => {
  function Wrapper(props) {
    const user = useSelector((store) => store.auth.user);
    const isInitialized = useSelector((store) => store.auth.isInitialized);
    const navigate = useNavigate();

    useEffect(() => {
      if (isInitialized && !user) {
        navigate("/login");
      }
    }, [user, isInitialized, navigate]);

    if (!isInitialized) {
      return null; 
    }

    return <Component {...props} />;
  }

  return Wrapper;
};

export default checkAuth;
