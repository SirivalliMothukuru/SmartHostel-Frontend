
import { useState } from "react";
import {
  Building2,
  Mail,
  LockKeyhole,
  User,
  Users
} from "lucide-react";
import api from "../api";

function Register({ onRegistered, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [block, setBlock] = useState("BOYS");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        block: role === "WARDEN" || role === "SECURITY" ? block : null
      });

      setSuccess(true);
      setMessage("Registration successful! You can now sign in.");
    } catch (error) {
      const data = error.response?.data;
      setMessage(
        typeof data === "string"
          ? data
          : data?.message || "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <div className="login-visual">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Building2 size={25} />
            </div>
            <span>
              Smart<span className="brand-accent">Hostel</span>
            </span>
          </div>

          <div className="login-visual-content">
            <span className="login-eyebrow">JOIN SMART HOSTEL</span>
            <h1>Your hostel journey starts here.</h1>
            <p>
              Create your account to access hostel services and
              everyday campus facilities.
            </p>
          </div>

          <div className="login-visual-footer">
            SMARTER MANAGEMENT. BETTER LIVING.
          </div>
        </div>

        <div className="login-form-side">
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-mobile-brand">
              <Building2 size={25} />
              SmartHostel
            </div>

            <div className="form-heading">
              <span className="form-welcome">GET STARTED</span>
              <h2>Create your account</h2>
              <p>Enter your details to register.</p>
            </div>

            <div className="form-field">
              <label htmlFor="register-name">Full name</label>
              <div className="form-input-wrap">
                <User size={18} />
                <input
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-email">Email address</label>
              <div className="form-input-wrap">
                <Mail size={18} />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <div className="form-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="register-role">Register as</label>
              <div className="form-input-wrap">
                <Users size={18} />
                <select
                  id="register-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="WARDEN">Warden</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SECURITY">Security</option>
                </select>
              </div>
            </div>

            {(role === "WARDEN" || role === "SECURITY") && (
              <div className="form-field">
                <label htmlFor="register-block">Assigned hostel block</label>
                <select
                  id="register-block"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  required
                >
                  <option value="BOYS">Boys Block</option>
                  <option value="GIRLS">Girls Block</option>
                </select>
              </div>
            )}

            {message && (
              <div
                className={success ? "login-success" : "login-error"}
                role="alert"
              >
                {message}
              </div>
            )}

            {success ? (
              <button
                className="login-submit"
                type="button"
                onClick={onBackToLogin}
              >
                Go to Sign in
              </button>
            ) : (
              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            )}

            <p className="register-prompt">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onBackToLogin}
                className="register-link"
              >
                Sign in
              </button>
            </p>
          </form>

          <footer className="login-copyright">
            © 2026 SmartHostel · Hostel Management Platform
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Register;
