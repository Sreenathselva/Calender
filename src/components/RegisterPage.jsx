import React from "react";

const RegisterPage = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    onSubmit?.(data); // { name, email, password }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register</h2>

        <label style={styles.label} htmlFor="name">Name</label>
        <input style={styles.input} id="name" name="name" type="text" placeholder="Your full name" required />

        <label style={styles.label} htmlFor="email">Email</label>
        <input style={styles.input} id="email" name="email" type="email" placeholder="you@example.com" required />

        <label style={styles.label} htmlFor="password">Password</label>
        <input style={styles.input} id="password" name="password" type="password" placeholder="••••••••" required />

        {/* <label style={styles.label} htmlFor="role">Role</label> */}
        {/* <select style={styles.input} id="role" name="role" defaultValue="user">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}

        <button style={styles.button} type="submit">Create Account</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "1rem",
  },
  form: {
    width: "100%",
    minHeight: "50vh",
    maxWidth: "50%",
    padding: "2rem",
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  title: {
    margin: 0,
    textAlign: "center",
    fontFamily: "montserrat",
    fontSize: "2rem",
    fontWeight: 600,
  },
  label: {
    fontSize: "1.4rem",
    fontWeight: 500,
    width:"80%"
  },
  input: {
    width: "80%",
    padding: "1rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.75rem 2rem",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: 600,
  },
};

export default RegisterPage;
