
import "./App.css";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./Dashboard";
import StudentDashboard from "./pages/StudentDashboard";

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

  const role = localStorage.getItem("role");

  if (role === "STUDENT") {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  return <Dashboard />;
}

export default App;
