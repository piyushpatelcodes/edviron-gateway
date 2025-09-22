import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getTokenFromCookie } from '../utils/getToken';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProtectedRoute() {
  const token = getTokenFromCookie();
  const [redirect, setRedirect] = useState(false);
  const theme = localStorage?.getItem("theme") || "light"

  useEffect(() => {
    if (!token) {
      toast.warn("You Are Not Logged In!!",{
        theme: theme
      });
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [token,theme]);

  if (!token && redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ToastContainer />
      {token ? <Outlet /> : null}
    </>
  );
}
