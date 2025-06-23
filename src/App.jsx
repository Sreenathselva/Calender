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
import DashboardSidebar from "./components/DashboardSidebar";
import Registrations from "./components/Registrations";
import Users from "./components/Users";
import axios from "axios";

const handleLogin = async (formData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/login", formData);
    const { user, token } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // user.role should be "admin" or "user"
    // Redirect
    window.location.href = "/calendar";
  } catch (error) {
    alert("Login failed: " + error.response?.data?.message || "Something went wrong");
  }
};
const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };


const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="container">
      <ErrorBoundary>
        <Router>
           {user && <Navbar onLogout={handleLogout}/>}
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
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardSidebar />
                </PrivateRoute>
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
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/users" element={<Users />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;