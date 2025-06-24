import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const updateApproval = async (id, newStatus) => {
    await fetch(`http://localhost:5000/users/${id}/access`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: newStatus }),
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <DashboardSidebar />

      <div style={styles.container} className="fade-page">
        <h2 style={styles.h2}>Users List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} style={styles.item}>
              <div style={styles.userName}>
                <strong>{user.username}</strong> — {user.role.toUpperCase()}

              </div>
              <p style={{ fontSize: "1.2rem", marginTop: ".5rem" }}>
                Status:{" "}
                {user.approved === 1
                  ? "✅ Approved"
                  : user.approved === 2
                    ? "🚫 Revoked"
                    : "❌ Not Approved"}
              </p>

              <div style={{ display: "flex", gap: "1rem" }}>
                {user.approved === 1 ? (
                  <button
                    style={styles.buttonRed}
                    onClick={() => updateApproval(user.id, 2)} // Revoke -> set to 2
                  >
                    Revoke Access
                  </button>
                ) : (
                  <button
                    style={styles.button}
                    onClick={() => updateApproval(user.id, 1)} // Grant -> set to 1
                  >
                    Grant Access
                  </button>
                )}

                <button
                  style={styles.deleteButton}
                  onClick={() => deleteUser(user.id)}
                >
                  Delete User
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
};

const styles = {
  container: { padding: "2rem 4rem 0 0", width: "75%", height: '75%', fontFamily: "Montserrat" },
  h2: {
    fontSize: "1.5vw",
    fontFamily: "montserrat",
    textTransform: "uppercase",
    color: "#fff",
  },
  buttonRed: {
    padding: ".5rem",
    borderRadius: ".5rem",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  },
  item: {
    margin: "1rem 0",
    padding: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(56, 74, 84)",
    borderRadius: "1vw",
    fontSize: "1.4rem",
    color: "#ffffff",
  },
  actions: { display: "flex", gap: "1rem" },
  userName: {
    width: "20vw"
  },
  button: {
    background: "green",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
  },
};

export default Users;