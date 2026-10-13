
import { useEffect, useState } from "react";

const API = "http://localhost:8081";

const menu = [
  { name: "Overview", icon: "◫" },
  { name: "Students", icon: "♙" },
  { name: "Rooms & Beds", icon: "▦" },
  { name: "Leave Requests", icon: "▤" },
  { name: "Digital Gate Pass", icon: "▣" },
  { name: "Complaints", icon: "⚒" },
  { name: "Hostel Snaps", icon: "▧" },
  { name: "Mess Management", icon: "♨" },
  { name: "Fees & Fines", icon: "₹" },
  { name: "Announcements", icon: "◉" },
  { name: "Settings", icon: "⚙" }
];

const colors = {
  navy: "#172554",
  blue: "#3157d5",
  bg: "#f5f7fc",
  text: "#18233c",
  muted: "#78849b",
  border: "#e6eaf2",
  green: "#15803d",
  red: "#dc2626"
};

const baseButton = {
  border: "none",
  borderRadius: 9,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13
};

const emptyStudent = {
  name: "",
  email: "",
  password: "",
  phone: "",
  rollNumber: ""
};

const emptyRoom = {
  studentId: "",
  hostelBlock: "BOYS",
  roomNumber: "",
  floor: "",
  bedNumber: "",
  roomType: "SHARED"
};

function WardenDashboard({ onLogout }) {
  const [section, setSection] = useState("Overview");
  const [passes, setPasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [snaps, setSnaps] = useState([]);
  const [roomAllocations, setRoomAllocations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [snapLoading, setSnapLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);
  const [updatingComplaint, setUpdatingComplaint] = useState(null);
  const [updatingSnap, setUpdatingSnap] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [studentForm, setStudentForm] = useState(emptyStudent);

  const [complaintStatus, setComplaintStatus] = useState("ALL");

  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState(emptyRoom);

  const block = (localStorage.getItem("block") || "BOYS").toUpperCase();
  const email = localStorage.getItem("email") || "Warden";
  const [messMenus, setMessMenus] = useState([]);
const [messLoading, setMessLoading] = useState(false);
const [savingMessMenu, setSavingMessMenu] = useState(false);
const [editingMessMenuId, setEditingMessMenuId] = useState(null);

const [messMenuForm, setMessMenuForm] = useState({
  day: "Monday",
  mealType: "Breakfast",
  menuItems: "",
  servingTime: ""
});

  const cardStyle = {
    background: "#fff",
    border: `1px solid ${colors.border}`,
    borderRadius: 15,
    padding: 20
  };

  const smallLabel = {
    color: colors.muted,
    fontSize: 13,
    margin: "0 0 10px"
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    border: `1px solid ${colors.border}`,
    borderRadius: 9,
    outlineColor: colors.blue,
    fontSize: 13
  };

  async function request(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No login token found. Please log in again.");
    }

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          (response.status === 401
            ? "Session expired. Please log in again."
            : response.status === 403
              ? "Access denied. Check warden permissions."
              : `Request failed (${response.status}).`)
      );
    }

    return data;
  }

async function loadMessMenus() {
  setMessLoading(true);
  setError("");

  try {
    const data = await request("/api/student/mess-menu");
    setMessMenus(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(err.message || "Failed to load mess menu");
  } finally {
    setMessLoading(false);
  }
  
function resetMessMenuForm() {
  setEditingMessMenuId(null);
  setMessMenuForm({
    day: "Monday",
    mealType: "Breakfast",
    menuItems: "",
    servingTime: ""
  });
}

function startEditMessMenu(menu) {
  setEditingMessMenuId(menu.id);
  setMessMenuForm({
    day: menu.day || "Monday",
    mealType: menu.mealType || "Breakfast",
    menuItems: menu.menuItems || "",
    servingTime: menu.servingTime || ""
  });
}

async function saveMessMenu(e) {
  e.preventDefault();
  setSavingMessMenu(true);
  setError("");
  setMessage("");

  try {
    const editing = editingMessMenuId !== null;

    await request(
      editing
        ? `/api/warden/mess-menu/${editingMessMenuId}`
        : "/api/warden/mess-menu",
      {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(messMenuForm)
      }
    );

    setMessage(editing ? "Menu updated successfully." : "Menu added successfully.");
    resetMessMenuForm();
    await loadMessMenus();
  } catch (err) {
    setError(err.message || "Could not save menu.");
  } finally {
    setSavingMessMenu(false);
  }
}

async function deleteMessMenu(id) {
  if (!window.confirm("Delete this menu item?")) return;

  try {
    await request(`/api/warden/mess-menu/${id}`, {
      method: "DELETE"
    });

    setMessage("Menu deleted successfully.");
    await loadMessMenus();
  } catch (err) {
    setError(err.message || "Could not delete menu.");
  }
}

}


  async function loadPasses() {
    setLoading(true);
    setError("");

    try {
      const data = await request("/api/warden/gate-passes/pending");
      setPasses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Cannot load gate passes.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    setStudentLoading(true);
    setError("");

    try {
      const data = await request("/api/warden/students");

      if (!Array.isArray(data)) {
        throw new Error("Unexpected students API response.");
      }

      setStudents(data);
    } catch (err) {
      setError(err.message || "Cannot load students.");
    } finally {
      setStudentLoading(false);
    }
  }

  async function loadComplaints() {
    setComplaintLoading(true);
    setError("");

    try {
      const data = await request("/api/warden/complaints");

      if (!Array.isArray(data)) {
        throw new Error("Unexpected complaints API response.");
      }

      setComplaints(data);
    } catch (err) {
      setError(err.message || "Cannot load complaints.");
    } finally {
      setComplaintLoading(false);
    }
  }

  async function loadSnaps() {
    setSnapLoading(true);
    setError("");

    try {
      const data = await request(`/api/snaps?block=${encodeURIComponent(block)}`);
      if (!Array.isArray(data)) {
        throw new Error("Unexpected hostel snaps API response.");
      }
      setSnaps(data);
    } catch (err) {
      setError(err.message || "Unable to load hostel snaps.");
    } finally {
      setSnapLoading(false);
    }
  }

  function snapImageSource(imageData) {
    if (!imageData) return "";
    if (imageData.startsWith("data:image/")) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
  }

  async function updateSnap(id, status) {
    setUpdatingSnap(id);
    setError("");
    setMessage("");

    try {
      await request(`/api/snaps/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setMessage(`Hostel snap #${id} updated successfully.`);
      await loadSnaps();
    } catch (err) {
      setError(err.message || "Unable to update hostel snap.");
    } finally {
      setUpdatingSnap(null);
    }
  }

  async function updateComplaint(id, status) {
    setUpdatingComplaint(id);
    setError("");
    setMessage("");

    try {
      await request(`/api/warden/complaints/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      setMessage(`Complaint #${id} updated successfully.`);
      await loadComplaints();
    } catch (err) {
      setError(err.message || "Unable to update complaint.");
    } finally {
      setUpdatingComplaint(null);
    }
  }

  async function loadRoomAllocations() {
    setRoomLoading(true);
    setError("");

    try {
      const data = await request("/api/warden/room-allocations");
      setRoomAllocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load room allocations.");
    } finally {
      setRoomLoading(false);
    }
  }

  function openNewRoomForm() {
    setEditingRoomId(null);
    setRoomForm({ ...emptyRoom, hostelBlock: block });
    setRoomFormOpen(true);
    setError("");
    setMessage("");
  }

  function openEditRoomForm(room) {
    setEditingRoomId(room.id);
    setRoomForm({
      studentId: String(room.studentId ?? ""),
      hostelBlock: room.hostelBlock || block,
      roomNumber: room.roomNumber || "",
      floor: String(room.floor ?? ""),
      bedNumber: room.bedNumber || "",
      roomType: room.roomType || "SHARED"
    });
    setRoomFormOpen(true);
    setError("");
    setMessage("");
  }

  async function saveRoomAllocation(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!roomForm.studentId || Number(roomForm.studentId) <= 0) {
      setError("Enter a valid student ID.");
      return;
    }

    if (
      !roomForm.roomNumber.trim() ||
      !roomForm.floor.trim() ||
      !roomForm.bedNumber.trim()
    ) {
      setError("Room number, floor, and bed number are required.");
      return;
    }

    setSavingRoom(true);

    try {
      const editing = editingRoomId !== null;

      const payload = {
        ...roomForm,
        studentId: Number(roomForm.studentId),
        roomNumber: roomForm.roomNumber.trim(),
        floor: roomForm.floor.trim(),
        bedNumber: roomForm.bedNumber.trim(),
        hostelBlock: roomForm.hostelBlock.toUpperCase(),
        roomType: roomForm.roomType,
        status: "ALLOCATED"
      };

      await request(
        editing
          ? `/api/warden/room-allocations/${editingRoomId}`
          : "/api/warden/room-allocations",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setRoomFormOpen(false);
      setEditingRoomId(null);
      setMessage(editing ? "Room allocation updated." : "Bed allocated successfully.");
      await loadRoomAllocations();
    } catch (err) {
      setError(err.message || "Unable to save room allocation.");
    } finally {
      setSavingRoom(false);
    }
  }

  async function deleteRoomAllocation(id) {
    if (!window.confirm("Remove this room allocation?")) return;

    setError("");
    setMessage("");

    try {
      await request(`/api/warden/room-allocations/${id}`, {
        method: "DELETE"
      });

      setMessage("Room allocation removed successfully.");
      await loadRoomAllocations();
    } catch (err) {
      setError(err.message || "Unable to remove allocation.");
    }
  }

  useEffect(() => {
    loadPasses();
    loadStudents();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setStudentForm(emptyStudent);
    setShowStudentForm(true);
    setError("");
    setMessage("");
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      password: "",
      phone: student.phone || "",
      rollNumber: student.rollNumber || ""
    });
    setShowStudentForm(true);
    setError("");
    setMessage("");
  }

  function closeStudentForm() {
    setShowStudentForm(false);
    setEditingId(null);
    setStudentForm(emptyStudent);
  }

  function changeStudentField(event) {
    const { name, value } = event.target;
    setStudentForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function saveStudent(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!studentForm.name.trim() || !studentForm.email.trim()) {
      setError("Student name and email are required.");
      return;
    }

    if (editingId === null && !studentForm.password.trim()) {
      setError("Enter a temporary password for the new student.");
      return;
    }

    setSavingStudent(true);

    const payload = {
      name: studentForm.name.trim(),
      email: studentForm.email.trim(),
      phone: studentForm.phone.trim(),
      rollNumber: studentForm.rollNumber.trim()
    };

    if (studentForm.password.trim()) {
      payload.password = studentForm.password;
    }

    try {
      const editing = editingId !== null;

      await request(
        editing
          ? `/api/warden/students/${editingId}`
          : "/api/warden/students",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      closeStudentForm();
      setMessage(editing ? "Student updated successfully." : "Student added successfully.");
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to save student.");
    } finally {
      setSavingStudent(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await request(`/api/warden/students/${student.id}`, {
        method: "DELETE"
      });

      setMessage(`${student.name} deleted successfully.`);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to delete student.");
    }
  }

  async function updatePass(id, action) {
    setError("");
    setMessage("");

    let body;

    if (action === "reject") {
      const reason = window.prompt("Enter the reason for rejection:");

      if (!reason?.trim()) return;

      body = JSON.stringify({ rejectionReason: reason.trim() });
    }

    try {
      await request(`/api/warden/gate-passes/${id}/${action}`, {
        method: "PUT",
        ...(body ? { body } : {})
      });

      setMessage(`Gate pass #${id} updated.`);
      await loadPasses();
    } catch (err) {
      setError(err.message || "Could not update the request.");
    }
  }

  const filteredStudents = students.filter((student) =>
    [student.id, student.name, student.email, student.phone, student.rollNumber]
      .some((value) =>
        String(value || "").toLowerCase().includes(search.trim().toLowerCase())
      )
  );

  const filteredPasses = passes.filter((pass) =>
    [pass.id, pass.studentId, pass.reason, pass.description, pass.status]
      .some((value) =>
        String(value || "").toLowerCase().includes(search.trim().toLowerCase())
      )
  );

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      complaintStatus === "ALL" || complaint.status === complaintStatus;

    const term = search.trim().toLowerCase();

    const matchesSearch = [
      complaint.id,
      complaint.studentId,
      complaint.title,
      complaint.category,
      complaint.description,
      complaint.priority,
      complaint.status
    ].some((value) => String(value || "").toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const filteredRooms = roomAllocations.filter((room) => {
    const term = search.trim().toLowerCase();

    return [
      room.id,
      room.studentId,
      room.hostelBlock,
      room.roomNumber,
      room.floor,
      room.bedNumber,
      room.roomType,
      room.status
    ].some((value) => String(value || "").toLowerCase().includes(term));
  });

  function notice(title) {
    return (
      <div style={{ ...cardStyle, marginTop: 18, textAlign: "center", padding: 28 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
        <h3>{title}</h3>
        <p style={{ color: colors.muted, lineHeight: 1.7 }}>
          This section still needs its backend API and database operations.
        </p>
      </div>
    );
  }

  function renderStudentForm() {
    if (!showStudentForm) return null;

    return (
      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h3>{editingId === null ? "Add New Student" : "Edit Student"}</h3>

        <form onSubmit={saveStudent}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14
          }}>
            {[
              ["name", "Full Name", "text"],
              ["email", "Email Address", "email"],
              ["rollNumber", "Roll Number", "text"],
              ["phone", "Phone Number", "tel"]
            ].map(([name, label, type]) => (
              <label key={name} style={{ fontSize: 13, fontWeight: 600 }}>
                {label}
                <input
                  required={name === "name" || name === "email"}
                  name={name}
                  type={type}
                  value={studentForm[name]}
                  onChange={changeStudentField}
                  style={{ ...inputStyle, marginTop: 7 }}
                />
              </label>
            ))}

            <label style={{ fontSize: 13, fontWeight: 600 }}>
              {editingId === null ? "Temporary Password" : "New Password (optional)"}
              <input
                name="password"
                type="password"
                value={studentForm.password}
                onChange={changeStudentField}
                required={editingId === null}
                autoComplete="new-password"
                style={{ ...inputStyle, marginTop: 7 }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              type="submit"
              disabled={savingStudent}
              style={{ ...baseButton, background: colors.blue, color: "#fff" }}
            >
              {savingStudent ? "Saving..." : editingId === null ? "Add Student" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={closeStudentForm}
              style={{ ...baseButton, background: colors.bg, color: colors.text }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  function renderStudents() {
    return (
      <>
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap"
          }}>
            <div>
              <h3 style={{ margin: "0 0 6px" }}>Registered Students</h3>
              <p style={{ color: colors.muted, fontSize: 13, margin: 0 }}>
                View and manage student records.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={openAddForm} style={{ ...baseButton, background: colors.blue, color: "#fff" }}>
                + Add Student
              </button>
              <button onClick={loadStudents} disabled={studentLoading} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
                {studentLoading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            style={{ ...inputStyle, marginTop: 18 }}
          />

          <p style={{ fontSize: 13, color: colors.muted }}>
            Total: {students.length} · Search results: {filteredStudents.length}
          </p>
        </div>

        {renderStudentForm()}

        {studentLoading && students.length === 0 ? (
          <div style={cardStyle}>Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ ...cardStyle, marginTop: 18 }}>No matching students found.</div>
        ) : (
          <div style={{ ...cardStyle, marginTop: 18, padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 850, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["ID", "Roll Number", "Name", "Email", "Phone", "Actions"].map((heading) => (
                    <th key={heading} style={{ padding: 14, fontSize: 12, color: colors.muted, borderBottom: `1px solid ${colors.border}` }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    {[student.id, student.rollNumber, student.name, student.email, student.phone].map((value, index) => (
                      <td key={index} style={{ padding: 14, fontSize: 13, borderBottom: `1px solid ${colors.border}` }}>
                        {value || "—"}
                      </td>
                    ))}
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      <button onClick={() => openEditForm(student)} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>Edit</button>
                      <button onClick={() => deleteStudent(student)} style={{ ...baseButton, background: "#fee2e2", color: colors.red, marginLeft: 6 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  function renderPasses() {
    return (
      <>
        <div style={{ margin: "20px 0" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pass, student ID or reason..."
            style={inputStyle}
          />
        </div>

        {loading ? (
          <div style={cardStyle}>Loading gate passes...</div>
        ) : filteredPasses.length === 0 ? (
          <div style={cardStyle}>No matching requests found.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredPasses.map((pass) => (
              <article key={pass.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <p style={smallLabel}>GATE PASS #{pass.id}</p>
                    <h3>{pass.reason || pass.description || "Gate Pass Request"}</h3>
                  </div>
                  <strong>{pass.status || "PENDING"}</strong>
                </div>

                <p style={{ color: colors.muted, lineHeight: 1.7 }}>{pass.description}</p>
                <p style={{ fontSize: 13 }}>Student: #{pass.studentId} · Block: {pass.hostelBlock || "—"}</p>
                <p style={{ fontSize: 13 }}>From: {pass.fromDate || "—"} · To: {pass.toDate || "—"}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => updatePass(pass.id, "approve")} style={{ ...baseButton, background: "#dcfce7", color: colors.green }}>Approve</button>
                  <button onClick={() => updatePass(pass.id, "reject")} style={{ ...baseButton, background: "#fee2e2", color: colors.red }}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderComplaints() {
    const counts = {
      ALL: complaints.length,
      PENDING: complaints.filter((c) => c.status === "PENDING").length,
      IN_PROGRESS: complaints.filter((c) => c.status === "IN_PROGRESS").length,
      RESOLVED: complaints.filter((c) => c.status === "RESOLVED").length
    };

    return (
      <>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginTop: 20
        }}>
          {[
            ["Total", counts.ALL],
            ["Pending", counts.PENDING],
            ["In Progress", counts.IN_PROGRESS],
            ["Resolved", counts.RESOLVED]
          ].map(([label, value]) => (
            <div key={label} style={cardStyle}>
              <p style={smallLabel}>{label}</p>
              <strong style={{ fontSize: 24 }}>{value}</strong>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            style={{ ...inputStyle, flex: "1 1 220px" }}
          />

          <select
            value={complaintStatus}
            onChange={(e) => setComplaintStatus(e.target.value)}
            style={{ ...inputStyle, width: 180 }}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button onClick={loadComplaints} disabled={complaintLoading} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
            {complaintLoading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {complaintLoading ? (
          <div style={cardStyle}>Loading complaints...</div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: 35 }}>
            <div style={{ fontSize: 32 }}>⚒</div>
            <h3>No complaints found</h3>
            <p style={{ color: colors.muted }}>Try another status filter or refresh the list.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredComplaints.map((complaint) => (
              <article key={complaint.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <p style={smallLabel}>COMPLAINT #{complaint.id}</p>
                    <h3 style={{ margin: "6px 0 10px" }}>{complaint.title}</h3>
                  </div>

                  <span style={{
                    background: complaint.priority === "HIGH" ? "#fee2e2" : complaint.priority === "LOW" ? "#dcfce7" : "#fff3d5",
                    color: complaint.priority === "HIGH" ? colors.red : complaint.priority === "LOW" ? colors.green : "#925c00",
                    padding: "7px 11px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {complaint.priority || "MEDIUM"} PRIORITY
                  </span>
                </div>

                <p style={{ color: colors.muted, fontSize: 13 }}>
                  {complaint.category} · Student #{complaint.studentId} · {complaint.hostelBlock} Block
                </p>

                <p style={{ lineHeight: 1.7, overflowWrap: "anywhere" }}>{complaint.description}</p>

                <div style={{ background: colors.bg, padding: 14, borderRadius: 10 }}>
                  <p style={smallLabel}>Status</p>
                  <strong>{(complaint.status || "PENDING").replace("_", " ")}</strong>
                  <p style={{ fontSize: 12, color: colors.muted }}>
                    Submitted: {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "—"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  {complaint.status !== "IN_PROGRESS" && complaint.status !== "RESOLVED" && complaint.status !== "REJECTED" && (
                    <button disabled={updatingComplaint === complaint.id} onClick={() => updateComplaint(complaint.id, "IN_PROGRESS")} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
                      Start Working
                    </button>
                  )}

                  {complaint.status !== "RESOLVED" && (
                    <button disabled={updatingComplaint === complaint.id} onClick={() => updateComplaint(complaint.id, "RESOLVED")} style={{ ...baseButton, background: "#dcfce7", color: colors.green }}>
                      Mark Resolved
                    </button>
                  )}

                  {complaint.status !== "REJECTED" && complaint.status !== "RESOLVED" && (
                    <button disabled={updatingComplaint === complaint.id} onClick={() => updateComplaint(complaint.id, "REJECTED")} style={{ ...baseButton, background: "#fee2e2", color: colors.red }}>
                      Reject
                    </button>
                  )}

                  {updatingComplaint === complaint.id && <span style={{ fontSize: 12 }}>Updating...</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderHostelSnaps() {
    const term = search.trim().toLowerCase();
    const filteredSnaps = snaps.filter((snap) =>
      [snap.id, snap.studentId, snap.title, snap.category, snap.location,
       snap.description, snap.status, snap.hostelBlock]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );

    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <h3 style={{ marginTop: 0 }}>Student Hostel Snaps</h3>
          <p style={{ color: colors.muted, fontSize: 13, lineHeight: 1.6 }}>
            Photos and reports submitted by students in the {block.toLowerCase()} block.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search snaps by title, location or category..."
              style={{ ...inputStyle, flex: "1 1 240px" }}
            />
            <button onClick={loadSnaps} disabled={snapLoading}
              style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
              {snapLoading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
          <p style={{ color: colors.muted, fontSize: 12, marginBottom: 0 }}>
            Total reports: {snaps.length}
          </p>
        </div>

        {snapLoading ? (
          <div style={cardStyle}>Loading hostel snaps...</div>
        ) : filteredSnaps.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 32 }}>▧</div>
            <h3>No hostel snaps found</h3>
            <p style={{ color: colors.muted }}>Refresh or try a different search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {filteredSnaps.map((snap) => (
              <article key={snap.id} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                {snap.imageData ? (
                  <a href={snapImageSource(snap.imageData)} target="_blank" rel="noreferrer">
                    <img
                      src={snapImageSource(snap.imageData)}
                      alt={snap.title || "Student hostel snap"}
                      style={{ width: "100%", height: 230, objectFit: "cover", display: "block", background: colors.bg }}
                    />
                  </a>
                ) : (
                  <div style={{ height: 150, display: "grid", placeItems: "center", background: colors.bg, color: colors.muted }}>
                    No photo attached
                  </div>
                )}
                <div style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                    <div>
                      <p style={smallLabel}>HOSTEL SNAP #{snap.id}</p>
                      <h3 style={{ margin: "0 0 10px" }}>{snap.title}</h3>
                    </div>
                    <span style={{ background: snap.status === "RESOLVED" ? "#dcfce7" : "#fff3d5", color: snap.status === "RESOLVED" ? colors.green : "#925c00", padding: "6px 9px", borderRadius: 16, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {snap.status || "PENDING"}
                    </span>
                  </div>
                  <p style={{ color: colors.muted, fontSize: 12 }}>
                    {snap.category || "Uncategorized"} · Student #{snap.studentId} · {snap.hostelBlock || block} Block
                  </p>
                  <p style={{ fontSize: 13, margin: "8px 0" }}><strong>Location:</strong> {snap.location || "—"}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, overflowWrap: "anywhere" }}>{snap.description}</p>
                  <p style={{ color: colors.muted, fontSize: 11, marginBottom: 0 }}>
                    Submitted: {snap.createdAt ? new Date(snap.createdAt).toLocaleString() : "—"}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {snap.status !== "IN_PROGRESS" && snap.status !== "RESOLVED" && snap.status !== "REJECTED" && (
                      <button disabled={updatingSnap === snap.id} onClick={() => updateSnap(snap.id, "IN_PROGRESS")} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
                        Start Working
                      </button>
                    )}
                    {snap.status !== "RESOLVED" && (
                      <button disabled={updatingSnap === snap.id} onClick={() => updateSnap(snap.id, "RESOLVED")} style={{ ...baseButton, background: "#dcfce7", color: colors.green }}>
                        Mark Resolved
                      </button>
                    )}
                    {snap.status !== "REJECTED" && snap.status !== "RESOLVED" && (
                      <button disabled={updatingSnap === snap.id} onClick={() => updateSnap(snap.id, "REJECTED")} style={{ ...baseButton, background: "#fee2e2", color: colors.red }}>
                        Reject
                      </button>
                    )}
                    {updatingSnap === snap.id && <span style={{ fontSize: 12 }}>Updating...</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderRooms() {
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: "0 0 6px" }}>Room & Bed Allocation</h3>
              <p style={{ color: colors.muted, fontSize: 13, margin: 0 }}>
                Assign and manage student room allocations.
              </p>
            </div>

            <button onClick={openNewRoomForm} style={{ ...baseButton, background: colors.blue, color: "#fff" }}>
              + Allocate Bed
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginTop: 20
          }}>
            <div>
              <p style={smallLabel}>Total Allocations</p>
              <strong style={{ fontSize: 22 }}>{roomAllocations.length}</strong>
            </div>
            <div>
              <p style={smallLabel}>Boys Block</p>
              <strong style={{ fontSize: 22 }}>{roomAllocations.filter((r) => r.hostelBlock === "BOYS").length}</strong>
            </div>
            <div>
              <p style={smallLabel}>Girls Block</p>
              <strong style={{ fontSize: 22 }}>{roomAllocations.filter((r) => r.hostelBlock === "GIRLS").length}</strong>
            </div>
          </div>
        </div>

        {roomFormOpen && (
          <form onSubmit={saveRoomAllocation} style={{ ...cardStyle, marginBottom: 18 }}>
            <h3>{editingRoomId !== null ? "Edit Allocation" : "Allocate a Bed"}</h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14
            }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Student ID
                <input
                  required
                  type="number"
                  min="1"
                  value={roomForm.studentId}
                  onChange={(e) => setRoomForm({ ...roomForm, studentId: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Hostel Block
                <select
                  required
                  value={roomForm.hostelBlock}
                  onChange={(e) => setRoomForm({ ...roomForm, hostelBlock: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                >
                  <option value="BOYS">Boys Block</option>
                  <option value="GIRLS">Girls Block</option>
                </select>
              </label>

              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Room Number
                <input
                  required
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Floor
                <input
                  required
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Bed Number
                <input
                  required
                  value={roomForm.bedNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, bedNumber: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 600 }}>
                Room Type
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                  style={{ ...inputStyle, marginTop: 6 }}
                >
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="SHARED">Shared</option>
                </select>
              </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button type="submit" disabled={savingRoom} style={{ ...baseButton, background: colors.blue, color: "#fff" }}>
                {savingRoom ? "Saving..." : "Save Allocation"}
              </button>
              <button type="button" onClick={() => setRoomFormOpen(false)} style={{ ...baseButton, background: colors.bg, color: colors.text }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search allocations..."
            style={inputStyle}
          />
          <button onClick={loadRoomAllocations} disabled={roomLoading} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
            {roomLoading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {roomLoading ? (
          <div style={cardStyle}>Loading allocations...</div>
        ) : filteredRooms.length === 0 ? (
          <div style={cardStyle}>No room allocations found.</div>
        ) : (
          <div style={{ ...cardStyle, padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["Student ID", "Block", "Room", "Floor", "Bed", "Type", "Status", "Actions"].map((heading) => (
                    <th key={heading} style={{ padding: 13, fontSize: 12, color: colors.muted, borderBottom: `1px solid ${colors.border}` }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    {[room.studentId, room.hostelBlock, room.roomNumber, room.floor, room.bedNumber, room.roomType, room.status || "ALLOCATED"].map((value, index) => (
                      <td key={index} style={{ padding: 13, fontSize: 13, borderBottom: `1px solid ${colors.border}` }}>
                        {value ?? "—"}
                      </td>
                    ))}
                    <td style={{ padding: 10, whiteSpace: "nowrap" }}>
                      <button onClick={() => openEditRoomForm(room)} style={{ ...baseButton, background: "#e8edff", color: colors.blue }}>
                        Edit
                      </button>
                      <button onClick={() => deleteRoomAllocation(room.id)} style={{ ...baseButton, background: "#fee2e2", color: colors.red, marginLeft: 5 }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function renderOverview() {
    return (
      <>
        <div style={{
          background: `linear-gradient(120deg, ${colors.navy}, #3457a5)`,
          color: "white",
          borderRadius: 17,
          padding: "28px 24px",
          margin: "22px 0"
        }}>
          <p style={{ margin: "0 0 10px", color: "#dbeafe" }}>WARDEN WORKSPACE</p>
          <h2 style={{ fontSize: 27, margin: "0 0 12px" }}>Welcome back!</h2>
          <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.7 }}>
            Manage hostel activities and keep your {block.toLowerCase()} block running smoothly.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16
        }}>
          {[
            { label: "Pending Gate Passes", value: passes.length, icon: "▣", color: "#e9edff" },
            { label: "Registered Students", value: students.length, icon: "♙", color: "#e0f7ec" },
            { label: "Complaints", value: complaints.length, icon: "⚒", color: "#fff0d8" },
            { label: "Room Allocations", value: roomAllocations.length, icon: "▦", color: "#e2f4ff" }
          ].map((item) => (
            <div key={item.label} style={cardStyle}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: item.color, display: "grid", placeItems: "center", fontSize: 21, marginBottom: 18 }}>
                {item.icon}
              </div>
              <p style={smallLabel}>{item.label}</p>
              <strong style={{ fontSize: 23 }}>{item.value}</strong>
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, marginTop: 20 }}>
          <h3>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12 }}>
            {[
              ["Review gate passes", "Digital Gate Pass"],
              ["Manage students", "Students"],
              ["Review complaints", "Complaints"],
              ["Room allocation", "Rooms & Beds"]
            ].map(([label, target]) => (
              <button
                key={target}
                onClick={() => selectSection(target)}
                style={{ ...baseButton, background: colors.bg, color: colors.text, textAlign: "left", padding: 16, border: `1px solid ${colors.border}` }}
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }
  function renderMessManagement() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Mess Menu Management</h2>
      <p>Add and manage the hostel mess menu.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={saveMessMenu}>
        <div>
          <label>Day</label>
          <select
            value={messMenuForm.day}
            onChange={(e) =>
              setMessMenuForm({ ...messMenuForm, day: e.target.value })
            }
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Meal</label>
          <select
            value={messMenuForm.mealType}
            onChange={(e) =>
              setMessMenuForm({ ...messMenuForm, mealType: e.target.value })
            }
          >
            {["Breakfast", "Lunch", "Snacks", "Dinner"].map(meal => (
              <option key={meal} value={meal}>{meal}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Food Items</label>
          <textarea
            value={messMenuForm.menuItems}
            onChange={(e) =>
              setMessMenuForm({ ...messMenuForm, menuItems: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Serving Time</label>
          <input
            value={messMenuForm.servingTime}
            onChange={(e) =>
              setMessMenuForm({ ...messMenuForm, servingTime: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" disabled={savingMessMenu}>
          {savingMessMenu ? "Saving..." : editingMessMenuId ? "Update Menu" : "Add Menu"}
        </button>

        {editingMessMenuId && (
          <button type="button" onClick={resetMessMenuForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr />

      <h3>Existing Menu</h3>
      <button type="button" onClick={loadMessMenus}>
        Refresh Menu
      </button>

      {messLoading ? (
        <p>Loading menu...</p>
      ) : messMenus.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        messMenus.map(menu => (
          <div key={menu.id} style={{ border: "1px solid #ccc", padding: "12px", marginTop: "12px" }}>
            <h4>{menu.day} — {menu.mealType}</h4>
            <p>{menu.menuItems}</p>
            <p>{menu.servingTime}</p>
            <button type="button" onClick={() => startEditMessMenu(menu)}>
              Edit
            </button>
            <button type="button" onClick={() => deleteMessMenu(menu.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

  function renderSection() {
    if (section === "Overview") return renderOverview();
    if (section === "Students") return renderStudents();
    if (section === "Complaints") return renderComplaints();
    if (section === "Hostel Snaps") return renderHostelSnaps();
    if (section === "Rooms & Beds") return renderRooms();
    if (section === "Digital Gate Pass" || section === "Leave Requests") return renderPasses();
    if (section === "Mess Management") return notice("Mess Management");
    if (section === "Fees & Fines") return notice("Fees and Fines");
    if (section === "Announcements") return notice("Hostel Announcements");

    return (
      <div style={cardStyle}>
        <h3>Account Settings</h3>
        <p>Signed in as: {email}</p>
        <p>Assigned hostel block: {block}</p>
        <button onClick={onLogout} style={{ ...baseButton, background: "#fee2e2", color: colors.red }}>
          Log out
        </button>
      </div>
    );
  }

  function selectSection(name) {
    setSection(name);
    setSearch("");
    setError("");
    setMessage("");
    setMobileMenu(false);

    if (name === "Students") loadStudents();
    if (name === "Complaints") loadComplaints();
    if (name === "Hostel Snaps") loadSnaps();
    if (name === "Rooms & Beds") loadRoomAllocations();

    if (name === "Digital Gate Pass" || name === "Leave Requests") {
      loadPasses();
    }
  }

  function refreshCurrentSection() {
    if (section === "Students") return loadStudents();
    if (section === "Complaints") return loadComplaints();
    if (section === "Hostel Snaps") return loadSnaps();
    if (section === "Rooms & Beds") return loadRoomAllocations();

    if (["Overview", "Digital Gate Pass", "Leave Requests"].includes(section)) {
      return loadPasses();
    }

    setMessage("This section still needs backend integration.");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bg,
      color: colors.text,
      fontFamily: "Inter, Arial, sans-serif",
      display: "flex"
    }}>
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{ position: "fixed", inset: 0, background: "#0006", zIndex: 10 }}
        />
      )}

      <aside className={`warden-sidebar ${mobileMenu ? "warden-sidebar-open" : ""}`} style={{
        width: 245,
        flexShrink: 0,
        background: "#fff",
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 11,
        overflowY: "auto"
      }}>
        <div style={{ padding: "25px 20px", borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
            <div style={{ background: colors.navy, color: "white", borderRadius: 12, width: 42, height: 42, display: "grid", placeItems: "center", fontSize: 22 }}>⌂</div>
            <div>
              <strong style={{ fontSize: 18 }}>SmartHostel</strong>
              <div style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>WARDEN PORTAL</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 13px", flex: 1 }}>
          <p style={{ color: colors.muted, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, paddingLeft: 10 }}>MAIN MENU</p>

          {menu.map((item) => {
            const active = section === item.name;

            return (
              <button
                key={item.name}
                onClick={() => selectSection(item.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 11px",
                  marginBottom: 4,
                  borderRadius: 9,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  background: active ? "#e9edff" : "transparent",
                  color: active ? colors.blue : "#58657d"
                }}
              >
                <span style={{ width: 22, fontSize: 17 }}>{item.icon}</span>
                {item.name}
                {item.name === "Digital Gate Pass" && passes.length > 0 && (
                  <span style={{ marginLeft: "auto", background: colors.blue, color: "white", borderRadius: 12, padding: "2px 7px", fontSize: 10 }}>
                    {passes.length}
                  </span>
                )}
                {item.name === "Complaints" && complaints.filter((c) => c.status === "PENDING").length > 0 && (
                  <span style={{ marginLeft: "auto", background: colors.red, color: "white", borderRadius: 12, padding: "2px 7px", fontSize: 10 }}>
                    {complaints.filter((c) => c.status === "PENDING").length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 15, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ padding: 13, background: colors.bg, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", color: colors.navy, display: "grid", placeItems: "center", fontWeight: 700 }}>W</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: "block", fontSize: 12 }}>Warden</strong>
              <span style={{ fontSize: 11, color: colors.muted }}>{block} Block</span>
            </div>
          </div>
          <button onClick={onLogout} style={{ ...baseButton, width: "100%", marginTop: 12, background: "#fff0f0", color: colors.red }}>
            ↪ Log Out
          </button>
        </div>
      </aside>

      <div className="warden-main" style={{ marginLeft: 245, flex: 1, minWidth: 0 }}>
        <header style={{
          background: "#fff",
          borderBottom: `1px solid ${colors.border}`,
          padding: "16px 26px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMobileMenu(!mobileMenu)} style={{ ...baseButton, background: colors.bg, color: colors.text }}>
              ☰
            </button>
            <div>
              <div style={{ fontWeight: 700 }}>{section}</div>
              <div style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>SmartHostel / Warden / {section}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{block} BLOCK</div>
            <div style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>Warden access</div>
          </div>
        </header>

        <main style={{ padding: "25px 26px 40px", maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 25, margin: "0 0 8px" }}>{section}</h1>
              <p style={{ color: colors.muted, margin: 0, fontSize: 13 }}>
                Manage your {block.toLowerCase()} hostel block.
              </p>
            </div>

            {section !== "Settings" && (
              <button onClick={refreshCurrentSection} style={{ ...baseButton, background: "#fff", border: `1px solid ${colors.border}`, color: colors.text }}>
                ↻ Refresh
              </button>
            )}
          </div>

          {error && (
            <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: 13, marginTop: 18 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: "#dcfce7", color: "#166534", borderRadius: 9, padding: 13, marginTop: 18 }}>
              {message}
            </div>
          )}

          {renderSection()}

          <footer style={{ borderTop: `1px solid ${colors.border}`, marginTop: 35, paddingTop: 18, color: colors.muted, fontSize: 11 }}>
            SmartHostel · AI-Powered Hostel Management · Warden Portal
          </footer>
        </main>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .warden-sidebar {
            transform: translateX(-100%);
            transition: transform 0.2s ease;
          }
          .warden-sidebar.warden-sidebar-open {
            transform: translateX(0);
          }
          .warden-main {
            margin-left: 0 !important;
            width: 100%;
          }
        }
        @media (min-width: 801px) {
          .warden-sidebar {
            transform: translateX(0);
          }
        }
        button:hover {
          filter: brightness(0.97);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default WardenDashboard;
