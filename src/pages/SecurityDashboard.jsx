
import { useState } from "react";
import {
  ShieldCheck,
  LogOut,
  Search,
  CheckCircle,
  Clock,
  Building2,
  RefreshCw,
  ArrowRightLeft,
  AlertCircle
} from "lucide-react";
import api from "../api";

export default function SecurityDashboard({ onLogout }) {
  const [token, setToken] = useState("");
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const block = localStorage.getItem("block") || "Not assigned";
  const email = localStorage.getItem("email") || "Security Staff";

  const verifyPass = async (event) => {
    if (event) event.preventDefault();

    if (!token.trim()) {
      setError("Enter a gate-pass token first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setPass(null);

    try {
      const response = await api.get(
        `/api/security/gate-passes/verify/${encodeURIComponent(token.trim())}`
      );

      const data = response.data;
      const verifiedPass = data.pass || data.gatePass || data;

      setPass(verifiedPass);
      setMessage("Gate pass verified successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Verification failed. Check the token and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const recordAction = async (action) => {
    if (!pass?.id) {
      setError("No valid gate pass selected.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        `/api/security/gate-passes/${pass.id}/${action}`
      );

      const updatedPass = response.data?.pass || response.data?.gatePass || response.data;

      if (updatedPass && typeof updatedPass === "object") {
        setPass((current) => ({ ...current, ...updatedPass }));
      }

      setMessage(
        action === "exit"
          ? "Student exit recorded successfully."
          : "Student return recorded successfully."
      );

      const refreshed = await api.get(
        `/api/security/gate-passes/verify/${encodeURIComponent(token.trim())}`
      );

      const refreshedPass =
        refreshed.data?.pass || refreshed.data?.gatePass || refreshed.data;

      setPass((current) => ({ ...current, ...refreshedPass }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to record this action. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasExited = Boolean(pass?.exitAt || pass?.exitRecorded);
  const hasReturned = Boolean(pass?.returnAt || pass?.returnRecorded);
  const isApproved = String(pass?.status || "").toUpperCase() === "APPROVED";
  const sameBlock =
    !pass?.hostelBlock ||
    !block ||
    block === "Not assigned" ||
    pass.hostelBlock.toUpperCase() === block.toUpperCase();

  const card = {
    background: "#fff",
    border: "1px solid #e5eaf2",
    borderRadius: 16,
    padding: 22,
    boxSizing: "border-box"
  };

  const label = {
    display: "block",
    color: "#64748b",
    fontSize: 12,
    marginBottom: 6
  };

  const value = {
    fontSize: 14,
    fontWeight: 700,
    overflowWrap: "anywhere"
  };

  const button = {
    border: 0,
    borderRadius: 9,
    padding: "12px 16px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      color: "#172033",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <header style={{
        background: "#111827",
        color: "#fff",
        padding: "18px 5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "#0d9488",
            padding: 10,
            borderRadius: 11,
            display: "flex"
          }}>
            <ShieldCheck size={25} />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800 }}>SmartHostel</div>
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>Security Dashboard</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{ ...button, background: "#374151", color: "#fff" }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </header>

      <main style={{
        maxWidth: 1050,
        margin: "0 auto",
        padding: "30px 20px"
      }}>
        <div style={{ marginBottom: 25 }}>
          <h1 style={{ fontSize: 27, margin: "0 0 8px" }}>Gate Pass Verification</h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
            Verify approved passes and record student exit and return.
          </p>
        </div>

        <div style={{
          ...card,
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 22
        }}>
          <Building2 size={25} color="#4f46e5" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={label}>Signed-in security account</div>
            <div style={value}>{email}</div>
          </div>
          <div>
            <div style={label}>Assigned block</div>
            <div style={value}>{block}</div>
          </div>
        </div>

        <form onSubmit={verifyPass} style={{ ...card, marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 8px" }}>Verify a gate pass</h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 18 }}>
            Enter the token from the student's approved gate pass.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste gate-pass token"
              style={{
                flex: "1 1 250px",
                minWidth: 0,
                padding: 13,
                border: "1px solid #dbe2ea",
                borderRadius: 9,
                fontSize: 14,
                boxSizing: "border-box"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                ...button,
                background: "#4f46e5",
                color: "#fff",
                opacity: loading ? 0.65 : 1
              }}
            >
              <Search size={17} />
              {loading ? "Please wait..." : "Verify Pass"}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            padding: 14,
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: 10,
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 13
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: 14,
            background: "#ecfdf5",
            color: "#047857",
            borderRadius: 10,
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontSize: 13
          }}>
            <CheckCircle size={18} /> {message}
          </div>
        )}

        {pass && (
          <div style={card}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 22
            }}>
              <div>
                <h2 style={{ fontSize: 19, margin: "0 0 6px" }}>Gate Pass Details</h2>
                <span style={{ color: "#64748b", fontSize: 12 }}>Pass ID: {pass.id ?? "—"}</span>
              </div>
              <span style={{
                background: isApproved && sameBlock ? "#dcfce7" : "#fee2e2",
                color: isApproved && sameBlock ? "#166534" : "#b91c1c",
                padding: "7px 12px",
                borderRadius: 20,
                fontWeight: 800,
                fontSize: 12
              }}>
                {isApproved && sameBlock ? "APPROVED" : "CHECK REQUIRED"}
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              marginBottom: 24
            }}>
              {[
                ["Student ID", pass.studentId],
                ["Hostel Block", pass.hostelBlock],
                ["Reason", pass.reason],
                ["From Date", pass.fromDate],
                ["To Date", pass.toDate],
                ["Status", pass.status],
                ["Exit Time", pass.exitAt || "Not recorded"],
                ["Return Time", pass.returnAt || "Not recorded"]
              ].map(([name, text]) => (
                <div key={name}>
                  <span style={label}>{name}</span>
                  <div style={value}>{text || "—"}</div>
                </div>
              ))}
            </div>

            {!sameBlock && (
              <div style={{
                padding: 12,
                background: "#fff7ed",
                color: "#9a3412",
                borderRadius: 9,
                marginBottom: 18,
                fontSize: 13
              }}>
                This pass belongs to another hostel block. Do not record exit or return.
              </div>
            )}

            <div style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              borderTop: "1px solid #edf0f5",
              paddingTop: 20
            }}>
              <button
                onClick={() => recordAction("exit")}
                disabled={loading || !isApproved || !sameBlock || hasExited}
                style={{
                  ...button,
                  background: "#0f766e",
                  color: "#fff",
                  opacity: loading || !isApproved || !sameBlock || hasExited ? 0.45 : 1
                }}
              >
                <LogOut size={17} />
                {hasExited ? "Exit Recorded" : "Record Exit"}
              </button>

              <button
                onClick={() => recordAction("return")}
                disabled={loading || !isApproved || !sameBlock || !hasExited || hasReturned}
                style={{
                  ...button,
                  background: "#4f46e5",
                  color: "#fff",
                  opacity: loading || !isApproved || !sameBlock || !hasExited || hasReturned ? 0.45 : 1
                }}
              >
                <ArrowRightLeft size={17} />
                {hasReturned ? "Return Recorded" : "Record Return"}
              </button>

              <button
                onClick={() => verifyPass()}
                disabled={loading}
                style={{
                  ...button,
                  background: "#f1f5f9",
                  color: "#334155"
                }}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            <p style={{
              marginTop: 18,
              color: "#64748b",
              fontSize: 12,
              lineHeight: 1.6
            }}>
              Exit must be recorded before return. The backend must independently validate the staff role, hostel block, approval status, and permitted dates for every action.
            </p>
          </div>
        )}

        {!pass && !error && (
          <div style={{
            ...card,
            textAlign: "center",
            padding: "40px 20px"
          }}>
            <Clock size={35} color="#94a3b8" />
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Ready to verify</h3>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              A verified gate pass will appear here.
            </p>
          </div>
        )}

        <footer style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: 11,
          marginTop: 28
        }}>
          SmartHostel © 2026 · Security & Gate Management
        </footer>
      </main>
    </div>
  );
}
