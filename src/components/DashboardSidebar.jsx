import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/pending-users");
        const data = await res.json();
        setPendingCount(data.length);
      } catch (err) {
        console.error("Error fetching pending users:", err);
      }
    };
    fetchCount();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.navCont}>
        <ul style={styles.ul}>
          <li
            style={{
              ...styles.li,
              backgroundColor: isActive("/dashboard") ? "#1e293b" : "transparent", textDecoration: "underline"
            }}
          >
            DASHBOARD
          </li>
          <li
            style={{
              ...styles.li,
              backgroundColor: isActive("/registrations") ? "#1e293b" : "transparent",
            }}
            onClick={() => navigate("/registrations")}
          >
            REGISTERATIONS{" "}
            {pendingCount > 0 && <span style={{ color: "red" }}>({pendingCount})</span>}
          </li>
          <li
            style={{
              ...styles.li,
              backgroundColor: isActive("/calendar") ? "#1e293b" : "transparent",
            }}
            onClick={() => navigate("/calendar")}
          >
            CALENDAR
          </li>
          <li
            style={{
              ...styles.li,
              backgroundColor: isActive("/users") ? "#1e293b" : "transparent",
            }}
            onClick={() => navigate("/users")}
          >
            USERS
          </li>
          <li
            style={{
              ...styles.li,
              backgroundColor: isActive("/dates") ? "#1e293b" : "transparent",
            }}
            onClick={() => navigate("/dates")}
          >
            DATES
          </li>
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    left: "0",
    width: "25%",
    height: "100%",
    color: "#fff",
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
    flexDirection: "column",
    padding: "0 1.5rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#384a54",
    padding: "3rem 0 3rem 3rem",
  },
  navCont: {
    height: "90%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    flexDirection: "column",
    padding: "1rem 0",
  },
  ul: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
  },
  li: {
    padding: "2rem 1rem",
    listStyleType: "none",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1.7rem",
    fontWeight: "600",
    letterSpacing: "1px",
    borderRadius: "6vw 0vw 0vw 6vw",
    cursor: "pointer",
    transition: "all 0.3s",
  },
};

export default DashboardSidebar;
