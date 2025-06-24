import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
          <li style={styles.li}
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            DASHBOARD
          </li>

          <li style={styles.li}
            className={`nav-item ${isActive("/registrations") ? "active" : ""}`}
            onClick={() => navigate("/registrations")}
          >
            REGISTRATIONS {pendingCount > 0 && <div style={styles.span}>{pendingCount}</div>}
          </li>

          <li style={styles.li}
            className={`nav-item ${isActive("/calendar") ? "active" : ""}`}
            onClick={() => navigate("/calendar")}
          >
            CALENDAR
          </li>

          <li style={styles.li}
            className={`nav-item ${isActive("/users") ? "active" : ""}`}
            onClick={() => navigate("/users")}
          >
            USERS
          </li>

         <li style={styles.li}
            className={`nav-item ${isActive("/dates") ? "active" : ""}`}
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
    width: "20%",
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
    padding: "2rem 3rem",
    listStyleType: "none",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1.7rem",
    display: "flex",
    gap: "1rem",
    fontWeight: "600",
    letterSpacing: "1px",
    borderRadius: "6vw 0vw 0vw 6vw",
    cursor: "pointer",
    textShadow:"1px 1px 1px #000000",
    transition: "all 0.3s ease",
  },
  span: {
    width: "1vw",
    height: "1vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "red",
    borderRadius: "5vw",
    fontSize: ".8vw"
  }
};

export default DashboardSidebar;