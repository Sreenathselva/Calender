import React, { useState, useEffect } from "react";

const DashboardSidebar = () => {

   const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await fetch("http://localhost:5000/pending-users");
      const data = await res.json();
      setPendingCount(data.length);
    };
    fetchCount();
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navCont}>
        <ul style={styles.ul}>
          <li style={styles.li}>DASHBOARD</li>
          <li style={styles.li}>REGISTERATIONS {pendingCount > 0 && <span style={{ color: 'red' }}>({pendingCount})</span>}</li>
          <li style={styles.li} className="nav-active">CALENDAR</li>
          <li style={styles.li}>USERS</li>
          <li style={styles.li}>DATES</li>
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
    padding: "3rem 0 3rem 3rem"
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
    borderRadius: "6vw 0vw 0vw 6vw"
  },
};


export default DashboardSidebar;