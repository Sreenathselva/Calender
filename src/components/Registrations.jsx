import React, { useEffect, useState } from "react";

const Registrations = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

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
    <div style={styles.container}>
      <h2>Pending Registration Requests</h2>
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
  );
};

const styles = {
  container: { padding: "2rem", fontFamily: "Montserrat" },
  item: { margin: "1rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  button: { background: "#2563eb", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" },
};

export default Registrations;