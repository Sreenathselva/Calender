import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CalendarApp.css";
import CalendarPage from "./pages/CalendarPage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import Register from "./pages/Register";
import PrivateRoute from "./components/privateRoute";
import RegisterPage from "./components/RegisterPage";
import axios from "axios"; // install if not yet: npm install axios

const handleLogin = async (formData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/login", formData);
    const { user, token } = response.data;

    // Store user session
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // user.role should be "admin" or "user"
    // Redirect
    window.location.href = "/calendar";
  } catch (error) {
    alert("Login failed: " + error.response?.data?.message || "Something went wrong");
  }
};


const App = () => {
  return (
    <div className="container">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={
                localStorage.getItem("user") ? (
                  <Navigate to="/calendar" />
                ) : (
                  <Login onSubmit={handleLogin} />
                )
              }
            />
            <Route path="/register" element={<Register />} />

            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage role={JSON.parse(localStorage.getItem("user"))?.role} />
                </PrivateRoute>
              }
            />

            <Route path="/registerPage" element={<RegisterPage />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;