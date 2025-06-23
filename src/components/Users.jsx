import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "./Navbar";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const toggleAccess = async (id, currentAccess) => {
    await fetch(`http://localhost:5000/users/${id}/access`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access: !currentAccess }),
    });
    fetchUsers(); // refresh list
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <DashboardSidebar />

      <div style={styles.container}>
        <h2 style={styles.h2}>Users List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} style={styles.item}>
              <div>
                <strong>{user.username}</strong> — Role: {user.role}
              </div>
              <div style={styles.actions}>
                <button onClick={() => toggleAccess(user.id, user.access)} style={styles.button}>
                  {user.access ? "Revoke Access" : "Grant Access"}
                </button>
                <button onClick={() => deleteUser(user.id)} style={styles.deleteButton}>
                  Delete
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
  container: { padding: "2rem", width: "75%", height: '75%', fontFamily: "Montserrat" },
  h2: {
    fontSize: "1.5vw",
    fontFamily: "montserrat",
    textTransform: "uppercase",
    color: "#fff",
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
  button: {
    background: "#2563eb",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
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