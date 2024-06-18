import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserFromLocalStorage } from '../../store/authSlice'; // Update the path if necessary

const AutoLogin = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserFromLocalStorage());
  }, [dispatch]);

  return <>{children}</>;
};

export default AutoLogin;
