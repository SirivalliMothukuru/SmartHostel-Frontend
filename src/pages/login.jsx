
import { useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users
} from "lucide-react";
import api from "../api";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
        role
      });

      const { token, role: accountRole, block, email: userEmail } =
        response.data;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      if (accountRole?.toUpperCase() !== role) {
        throw new Error("Selected role does not match your account.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", accountRole.toUpperCase());
      localStorage.setItem("block", block || "");
      localStorage.setItem("email", userEmail || email.trim());

      onLogin(response.data);
    } catch (error) {
      const data = error.response?.data;

      setMessage(
        typeof data === "string"
          ? data
          : data?.message ||
            error.message ||
            "Unable to sign in. Check your credentials and server."
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
            <span className="login-eyebrow">SMART CAMPUS LIVING</span>
            <h1>A better hostel experience starts here.</h1>
            <p>
              One place to manage hostel life, student services,
              and everyday campus needs.
            </p>

            <div className="login-feature">
              <div className="feature-icon">
                <ShieldCheck size={21} />
              </div>
              <div>
                <strong>One secure campus platform</strong>
                <span>Designed for students and hostel teams</span>
              </div>
            </div>
          </div>

          <div className="login-visual-footer">
            SMARTER MANAGEMENT. BETTER LIVING.
          </div>
        </div>

        <div className="login-form-side">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-mobile-brand">
              <Building2 size={25} />
              SmartHostel
            </div>

            <div className="form-heading">
              <span className="form-welcome">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>Enter your credentials to access your workspace.</p>
            </div>

            <div className="form-field">
              <label htmlFor="role">Login as</label>
              <div className="form-input-wrap">
                <Users size={18} />
                <select
                  id="role"
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

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <div className="form-input-wrap">
                <Mail size={18} />
                <input
                  id="email"
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
              <label htmlFor="password">Password</label>
              <div className="form-input-wrap">
                <LockKeyhole size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className="login-error" role="alert">
                {message}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing you in..." : "Sign in"}
            </button>

            <p className="register-prompt">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onRegister}
                className="register-link"
              >
                Register
              </button>
            </p>

            <div className="login-security">
              <ShieldCheck size={16} />
              Secure access to your hostel workspace
            </div>
          </form>

          <footer className="login-copyright">
            © 2026 SmartHostel · Hostel Management Platform
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Login;
