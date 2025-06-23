import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";
import { color } from "framer-motion";
const Registrations = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const handleLogout = () => {
    // localStorage.clear();
    window.location.href = "/login";
  };
  const fetchPending = async () => {
    const res = await fetch("http://localhost:5000/pending-users");
    const data = await res.json();
    setPendingUsers(data);
  };

  const approveUser = async (id) => {
    await fetch(`http://localhost:5000/approve-user/${id}`, { method: "PUT" });
    fetchPending(); // refresh
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <DashboardSidebar />

      <div style={styles.container}>
        <h2 style={styles.h2}>Pending Registration Requests</h2>
        {pendingUsers.length === 0 ? (
          <p>No pending users.</p>
        ) : (
          <ul>
            {pendingUsers.map((user) => (
              <li key={user.id} style={styles.item}>
                {user.username}
                <button style={styles.button} onClick={() => approveUser(user.id)}>Approve</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { padding: "2rem", width: "75%", height: '75%', fontFamily: "Montserrat" },
  h2:{
    fontSize:"1.5vw",
    fontFamily: "montserrat",
    textTransform: "uppercase",
    color: "#fff"
  },
  item: { 
    margin: "1rem 0",
    padding:"2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:  "rgb(56, 74, 84)",
    borderRadius: "1vw",
    fontSize: "1.4rem",
    color: "#ffffff"
  },
  button: { background: "#2563eb", 
    color: "#fff", 
    padding: "0.5rem 1rem", 
    border: "none", 
    borderRadius: "5px" 
  },
};

export default Registrations;