import React from "react";
import RegisterPage from "../components/RegisterPage"; // adjust path as needed

const Register = () => {
  const handleRegister = async (data) => {
    console.log("Sending data:", data); // Confirm this logs { name, email, password }
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // includes name, email, password, role
      });

      const result = await res.json();

      if (res.ok) {
        alert("Registered successfully!");
        // Optionally redirect to login
        window.location.href = "/login";
      } else {
        alert("Registration failed: " + result.message);
      }
    } catch (err) {
      console.error("Registration error", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return <RegisterPage onSubmit={handleRegister} />;
};

export default Register;
