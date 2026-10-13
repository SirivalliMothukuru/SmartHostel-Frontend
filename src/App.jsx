
import "./App.css";
import { useState } from "react";
import Login from "./pages/login.jsx";
import Register from "./pages/Register";
import Dashboard from "./Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("block");
    localStorage.removeItem("email");

    setLoggedIn(false);
    setShowRegister(false);
  };

  if (!loggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegistered={() => setShowRegister(false)}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  const role = localStorage.getItem("role")?.toUpperCase();

  if (role === "STUDENT") {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (role === "WARDEN") {
    return <WardenDashboard onLogout={handleLogout} />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (role === "SECURITY") {
    return <SecurityDashboard onLogout={handleLogout} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      padding: 20
    }}>
      <h2>Unrecognized Account Role</h2>
      <p>Please sign in again or contact the administrator.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "#4f46e5",
          color: "#fff",
          border: 0,
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default App;
