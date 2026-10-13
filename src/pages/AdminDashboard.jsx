
import { useState } from "react";
import {
  Building2,
  LayoutDashboard,
  Users,
  BedDouble,
  ShieldCheck,
  Utensils,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  ClipboardList,
  ChevronRight
} from "lucide-react";

const sections = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Students", icon: Users },
  { name: "Rooms & Beds", icon: BedDouble },
  { name: "Wardens & Security", icon: ShieldCheck },
  { name: "Mess Management", icon: Utensils },
  { name: "Fees & Fines", icon: CreditCard },
  { name: "Announcements", icon: Megaphone },
  { name: "Settings", icon: Settings }
];

const stats = [
  { label: "Total Students", value: "1,240", change: "Registered students", icon: Users, color: "#6366f1" },
  { label: "Available Beds", value: "86", change: "Ready for allocation", icon: BedDouble, color: "#0891b2" },
  { label: "Pending Complaints", value: "24", change: "Require attention", icon: ClipboardList, color: "#ea580c" },
  { label: "Fee Collection", value: "₹8.4L", change: "Current collection", icon: CreditCard, color: "#16a34a" }
];

const initialStudents = [
  { id: "SH001", name: "Sai Kumar", email: "sai@example.com", block: "BOYS", status: "Active" },
  { id: "SH002", name: "Priya Sharma", email: "priya@example.com", block: "GIRLS", status: "Active" },
  { id: "SH003", name: "Rahul Reddy", email: "rahul@example.com", block: "BOYS", status: "Pending" },
  { id: "SH004", name: "Ananya Rao", email: "ananya@example.com", block: "GIRLS", status: "Active" }
];

const initialRooms = [
  { room: "B-101", block: "BOYS", beds: 4, occupied: 3 },
  { room: "B-102", block: "BOYS", beds: 4, occupied: 4 },
  { room: "G-101", block: "GIRLS", beds: 4, occupied: 2 },
  { room: "G-102", block: "GIRLS", beds: 4, occupied: 3 }
];

const initialAnnouncements = [
  { title: "Monthly fee payment", detail: "Please complete fee payment before the due date.", date: "Today" },
  { title: "Hostel maintenance", detail: "Report room maintenance issues through the portal.", date: "Yesterday" },
  { title: "Mess feedback", detail: "Submit your feedback for the weekly menu.", date: "2 days ago" }
];

export default function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(initialStudents);
  const [rooms] = useState(initialRooms);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDetail, setNoticeDetail] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.id} ${student.block}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalBeds = rooms.reduce((sum, room) => sum + room.beds, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupied, 0);

  const addAnnouncement = (event) => {
    event.preventDefault();
    if (!noticeTitle.trim() || !noticeDetail.trim()) {
      setNoticeMessage("Please enter both a title and message.");
      return;
    }
    setAnnouncements([
      { title: noticeTitle.trim(), detail: noticeDetail.trim(), date: "Just now" },
      ...announcements
    ]);
    setNoticeTitle("");
    setNoticeDetail("");
    setNoticeMessage("Announcement added.");
  };

  const toggleStudentStatus = (id) => {
    setStudents(students.map((student) =>
      student.id === id
        ? { ...student, status: student.status === "Active" ? "Pending" : "Active" }
        : student
    ));
  };

  const styles = {
    app: {
      minHeight: "100vh",
      display: "flex",
      background: "#f5f7fb",
      color: "#172033",
      fontFamily: "Inter, Arial, sans-serif"
    },
    sidebar: {
      width: 250,
      flexShrink: 0,
      background: "#111827",
      color: "#e5e7eb",
      padding: "24px 15px",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      boxSizing: "border-box"
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 10px 28px",
      fontSize: 19,
      fontWeight: 800,
      color: "#fff"
    },
    logoIcon: {
      width: 39,
      height: 39,
      borderRadius: 12,
      background: "#6366f1",
      display: "grid",
      placeItems: "center"
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    },
    navButton: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      border: 0,
      borderRadius: 10,
      padding: "12px 13px",
      textAlign: "left",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer"
    },
    main: {
      minWidth: 0,
      flex: 1,
      padding: "25px 30px 40px"
    },
    topbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 15,
      marginBottom: 30
    },
    heading: {
      fontSize: 25,
      fontWeight: 800,
      margin: "0 0 6px"
    },
    muted: {
      color: "#758096",
      fontSize: 13
    },
    card: {
      background: "#fff",
      border: "1px solid #e8ebf2",
      borderRadius: 15,
      padding: 20,
      boxSizing: "border-box"
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: 750,
      margin: "0 0 17px"
    },
    tableWrap: {
      overflowX: "auto",
      width: "100%"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13,
      textAlign: "left"
    },
    th: {
      padding: "13px 12px",
      color: "#758096",
      background: "#f8f9fc",
      fontWeight: 700,
      whiteSpace: "nowrap"
    },
    td: {
      padding: "15px 12px",
      borderBottom: "1px solid #edf0f5",
      whiteSpace: "nowrap"
    },
    button: {
      border: 0,
      borderRadius: 8,
      padding: "9px 13px",
      fontWeight: 700,
      fontSize: 12,
      cursor: "pointer"
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #dfe4ed",
      borderRadius: 9,
      padding: "11px 12px",
      fontSize: 13,
      outlineColor: "#6366f1"
    }
  };

  const statusBadge = (status) => ({
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 750,
    color: status === "Active" ? "#15803d" : "#a16207",
    background: status === "Active" ? "#dcfce7" : "#fef3c7"
  });

  const selectSection = (name) => {
    setActive(name);
    setMobileOpen(false);
  };

  const renderOverview = () => (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 17, marginBottom: 24 }}>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={styles.muted}>{item.label}</span>
                <span style={{ background: `${item.color}18`, color: item.color, padding: 10, borderRadius: 11 }}>
                  <Icon size={19} />
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{item.value}</div>
              <div style={styles.muted}>{item.change}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Hostel Occupancy</h3>
          {[
            { name: "Boys Block", occupied: 720, total: 800, color: "#6366f1" },
            { name: "Girls Block", occupied: 434, total: 520, color: "#ec4899" }
          ].map((block) => (
            <div key={block.name} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, fontSize: 13 }}>
                <strong>{block.name}</strong>
                <span style={styles.muted}>{Math.round(block.occupied / block.total * 100)}%</span>
              </div>
              <div style={{ height: 9, borderRadius: 20, background: "#edf0f5", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${block.occupied / block.total * 100}%`, background: block.color, borderRadius: 20 }} />
              </div>
              <div style={{ ...styles.muted, marginTop: 7 }}>{block.occupied} of {block.total} beds occupied</div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          {[
            { title: "Manage students", subtitle: "Review student accounts", section: "Students", icon: Users },
            { title: "Manage rooms", subtitle: "View rooms and beds", section: "Rooms & Beds", icon: BedDouble },
            { title: "Post announcement", subtitle: "Share an update", section: "Announcements", icon: Megaphone }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.title} onClick={() => selectSection(action.section)} style={{ width: "100%", border: "1px solid #edf0f5", background: "#fff", borderRadius: 11, padding: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer" }}>
                <span style={{ padding: 10, borderRadius: 9, background: "#eef2ff", color: "#6366f1" }}><Icon size={18} /></span>
                <span style={{ flex: 1 }}>
                  <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{action.title}</strong>
                  <span style={styles.muted}>{action.subtitle}</span>
                </span>
                <ChevronRight size={17} color="#94a3b8" />
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Recent Students</h3>
        {renderStudentTable(4)}
      </div>
    </>
  );

  function renderStudentTable(limit) {
    const list = filteredStudents.slice(0, limit ?? filteredStudents.length);
    return (
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Student", "Email", "Block", "Status", "Action"].map((heading) => <th key={heading} style={styles.th}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}><strong>{student.name}</strong><div style={{ ...styles.muted, marginTop: 4 }}>{student.id}</div></td>
                <td style={styles.td}>{student.email}</td>
                <td style={styles.td}>{student.block}</td>
                <td style={styles.td}><span style={statusBadge(student.status)}>{student.status}</span></td>
                <td style={styles.td}>
                  <button onClick={() => toggleStudentStatus(student.id)} style={{ ...styles.button, background: "#eef2ff", color: "#4f46e5" }}>
                    Change status
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="5" style={{ ...styles.td, textAlign: "center", color: "#758096" }}>No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }

  const renderRooms = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Rooms & Beds</h3>
      <p style={styles.muted}>Sample room information for the Boys and Girls blocks.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "18px 0" }}>
        <div style={{ padding: 16, background: "#eef2ff", borderRadius: 11 }}><div style={styles.muted}>Total beds shown</div><strong style={{ fontSize: 25 }}>{totalBeds}</strong></div>
        <div style={{ padding: 16, background: "#ecfeff", borderRadius: 11 }}><div style={styles.muted}>Occupied beds shown</div><strong style={{ fontSize: 25 }}>{occupiedBeds}</strong></div>
        <div style={{ padding: 16, background: "#dcfce7", borderRadius: 11 }}><div style={styles.muted}>Available beds shown</div><strong style={{ fontSize: 25 }}>{totalBeds - occupiedBeds}</strong></div>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead><tr>{["Room", "Block", "Total beds", "Occupied", "Available"].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>{rooms.map((room) => <tr key={room.room}><td style={styles.td}><strong>{room.room}</strong></td><td style={styles.td}>{room.block}</td><td style={styles.td}>{room.beds}</td><td style={styles.td}>{room.occupied}</td><td style={styles.td}>{room.beds - room.occupied}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  const renderStaff = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Wardens & Security</h3>
      <p style={styles.muted}>Staff accounts must be created or assigned by an authorized administrator through a secure backend workflow.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 20 }}>
        <div style={{ border: "1px solid #e8ebf2", padding: 18, borderRadius: 12 }}>
          <ShieldCheck size={24} color="#6366f1" />
          <h4>Wardens</h4>
          <p style={styles.muted}>Review leave requests, approve gate passes, and manage hostel-block requests.</p>
        </div>
        <div style={{ border: "1px solid #e8ebf2", padding: 18, borderRadius: 12 }}>
          <ShieldCheck size={24} color="#0891b2" />
          <h4>Security Staff</h4>
          <p style={styles.muted}>Verify approved gate passes and record student exit and return times.</p>
        </div>
      </div>
    </div>
  );

  const renderMess = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Mess Management</h3>
      <p style={styles.muted}>Mess management preview. Connect these options to your backend to manage menus and meal attendance.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 15, marginTop: 20 }}>
        {[["Breakfast", "7:00 AM – 9:00 AM"], ["Lunch", "12:00 PM – 2:00 PM"], ["Snacks", "4:30 PM – 5:30 PM"], ["Dinner", "7:00 PM – 9:00 PM"]].map(([meal, time]) => (
          <div key={meal} style={{ padding: 18, background: "#f8fafc", border: "1px solid #edf0f5", borderRadius: 12 }}>
            <Utensils color="#ea580c" size={21} />
            <h4 style={{ margin: "12px 0 5px" }}>{meal}</h4>
            <p style={styles.muted}>{time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFees = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Fees & Fines</h3>
      <p style={styles.muted}>Fee collection summary preview. The figures below are examples and are not connected to actual payments.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 15, marginTop: 20 }}>
        {[["Collected", "₹8,40,000", "#dcfce7"], ["Pending", "₹1,25,000", "#fef3c7"], ["Fines", "₹12,500", "#fee2e2"]].map(([label, value, color]) => (
          <div key={label} style={{ padding: 18, background: color, borderRadius: 12 }}>
            <div style={styles.muted}>{label}</div>
            <div style={{ fontSize: 25, fontWeight: 800, marginTop: 10 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Post Announcement</h3>
        <form onSubmit={addAnnouncement} style={{ display: "grid", gap: 12 }}>
          <input style={styles.input} value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} placeholder="Announcement title" />
          <textarea style={{ ...styles.input, minHeight: 110, resize: "vertical" }} value={noticeDetail} onChange={(e) => setNoticeDetail(e.target.value)} placeholder="Write your message" />
          <button type="submit" style={{ ...styles.button, background: "#4f46e5", color: "#fff", padding: 12 }}>Publish announcement</button>
          {noticeMessage && <p style={styles.muted}>{noticeMessage}</p>}
        </form>
      </div>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Recent Announcements</h3>
        {announcements.map((notice, index) => (
          <div key={`${notice.title}-${index}`} style={{ padding: "14px 0", borderBottom: "1px solid #edf0f5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong style={{ fontSize: 14 }}>{notice.title}</strong>
              <span style={styles.muted}>{notice.date}</span>
            </div>
            <p style={{ ...styles.muted, lineHeight: 1.6 }}>{notice.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Settings</h3>
      <div style={{ padding: 15, borderRadius: 11, background: "#f8fafc", marginBottom: 12 }}>
        <strong>Hostel blocks</strong>
        <p style={styles.muted}>Boys Block and Girls Block are managed separately. Block-level access must be enforced by the backend.</p>
      </div>
      <div style={{ padding: 15, borderRadius: 11, background: "#f8fafc", marginBottom: 12 }}>
        <strong>Account security</strong>
        <p style={styles.muted}>Use authorized staff account creation and role-based access. Never rely on frontend role checks alone.</p>
      </div>
      <div style={{ padding: 15, borderRadius: 11, background: "#f8fafc" }}>
        <strong>System integration</strong>
        <p style={styles.muted}>Student, room, fee, and mess data in this first version are sample data. Connect backend API endpoints to make them live.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "Overview": return renderOverview();
      case "Students": return <div style={styles.card}><h3 style={styles.sectionTitle}>Student Management</h3><input style={{ ...styles.input, maxWidth: 360, marginBottom: 18 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, ID or block" />{renderStudentTable()}</div>;
      case "Rooms & Beds": return renderRooms();
      case "Wardens & Security": return renderStaff();
      case "Mess Management": return renderMess();
      case "Fees & Fines": return renderFees();
      case "Announcements": return renderAnnouncements();
      case "Settings": return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div style={styles.app}>
      {mobileOpen && <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ position: "fixed", inset: 0, zIndex: 9, background: "#0007", border: 0 }} />}
      <aside style={{ ...styles.sidebar, position: "sticky", top: 0, height: "100vh", overflowY: "auto", zIndex: 10, ...(mobileOpen ? { position: "fixed", left: 0, top: 0 } : {}) }}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}><Building2 size={22} color="#fff" /></span>
          <span>SmartHostel</span>
        </div>
        <div style={{ padding: "0 12px 12px", color: "#94a3b8", fontSize: 10, fontWeight: 800, letterSpacing: 1.5 }}>ADMIN PANEL</div>
        <nav style={styles.nav}>
          {sections.map((section) => {
            const Icon = section.icon;
            const selected = active === section.name;
            return (
              <button key={section.name} onClick={() => selectSection(section.name)} style={{ ...styles.navButton, background: selected ? "#3730a3" : "transparent", color: selected ? "#fff" : "#aeb8ca" }}>
                <Icon size={18} />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ margin: "20px 5px 0", padding: 13, borderRadius: 11, background: "#1f2937" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Administrator</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>SmartHostel control panel</div>
        </div>
        <button onClick={onLogout} style={{ ...styles.navButton, color: "#fca5a5", background: "transparent", marginTop: 12 }}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ ...styles.button, background: "#fff", border: "1px solid #e8ebf2", display: "none" }} className="admin-mobile-menu"><Menu size={19} /></button>
            <div>
              <h1 style={styles.heading}>{active}</h1>
              <div style={styles.muted}>Manage your hostel operations from one place.</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button aria-label="Announcements" onClick={() => selectSection("Announcements")} style={{ ...styles.button, background: "#fff", border: "1px solid #e8ebf2", padding: 11, color: "#475569" }}><Bell size={18} /></button>
            <div style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: "#e0e7ff", color: "#4338ca", fontWeight: 800 }}>A</div>
          </div>
        </header>
        {renderContent()}
        <footer style={{ marginTop: 28, textAlign: "center", color: "#94a3b8", fontSize: 11 }}>
          SmartHostel © 2026 · AI-Powered Hostel Management
        </footer>
      </main>

      <style>{`
        @media (max-width: 850px) {
          .admin-mobile-menu { display: inline-flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 850px) {
          aside { max-width: 260px; }
        }
      `}</style>
    </div>
  );
}
