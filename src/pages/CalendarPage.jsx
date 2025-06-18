// pages/CalendarPage.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CalendarApp from "../components/CalendarApp";

const CalendarPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return(
    <>
        <Navbar onLogout={handleLogout} />
        <CalendarApp role={user.role} />
    </>
  )
  
};

export default CalendarPage;