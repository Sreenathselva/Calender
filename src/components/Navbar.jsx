import React from "react";
import { useNavigate } from "react-router-dom";
import traicon from '../assets/traicon_logo.svg'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}><img className="tce-logo" src={traicon} alt="" /></div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top:"0",
    width: "100%",
    height: "60px",
    // background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1.5rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    fontFamily: "Montserrat, sans-serif",
  },
  logoutButton: {
    background: "#fff",
    color: "#2563eb",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Navbar;