import React from "react";
import LoginPage from "../components/LoginPage";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Login response:", result);

      if (res.ok) {
        // Check if user is approved
         console.log("✅ Login result:", result); // 👈 Add this
        if (!result.approved) {
          alert("Your account is pending admin approval.");
          return;
        }

        // alert("Login successful!");

        // ✅ Store user info safely before navigating
        localStorage.setItem("user", JSON.stringify(result));

        navigate("/calendar");
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong during login.");
    }
  };

  return <LoginPage onSubmit={handleLogin} />;
};

export default Login; 