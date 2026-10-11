
import { useState } from "react";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  Wallet,
  Utensils,
  ClipboardList,
  CalendarDays,
  Bell,
  Search,
  Menu,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock3,
  CircleAlert,
  ChevronDown,
  Plus,
  Sparkles,
  Building2,
  Settings,
  LogOut,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import "./App.css";

const navigation = [
  { title: "OVERVIEW", items: [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Students", icon: Users },
    { label: "Rooms & Beds", icon: BedDouble },
    { label: "Fees & Payments", icon: Wallet },
  ]},
  { title: "HOSTEL SERVICES", items: [
    { label: "Mess Management", icon: Utensils },
    { label: "Complaints", icon: ClipboardList },
    { label: "Leave Requests", icon: CalendarDays },
    { label: "Announcements", icon: Bell },
  ]},
];

const stats = [
  { label: "Total Students", value: "1,248", change: "+12.8%", up: true, icon: Users, color: "teal", note: "vs. last month" },
  { label: "Room Occupancy", value: "84.6%", change: "+4.2%", up: true, icon: BedDouble, color: "blue", note: "vs. last month" },
  { label: "Fees Collected", value: "₹18.4L", change: "+8.1%", up: true, icon: Wallet, color: "purple", note: "vs. last month" },
  { label: "Open Complaints", value: "24", change: "-16.3%", up: false, icon: ClipboardList, color: "orange", note: "vs. last month" },
];

const complaints = [
  { title: "Water leakage in bathroom", room: "Room B-204 · Boys Block", category: "Plumbing", status: "In Progress", priority: "High", initials: "RK", color: "avatar-teal" },
  { title: "Ceiling fan not working", room: "Room G-112 · Girls Block", category: "Electrical", status: "Pending", priority: "Medium", initials: "SP", color: "avatar-purple" },
  { title: "Wi-Fi connectivity issue", room: "Room B-308 · Boys Block", category: "Network", status: "In Progress", priority: "Low", initials: "AV", color: "avatar-blue" },
  { title: "Washroom cleaning required", room: "Floor 2 · Girls Block", category: "Cleaning", status: "Resolved", priority: "Low", initials: "NM", color: "avatar-orange" },
];

const activity = [
  { icon: CheckCircle2, color: "activity-green", title: "Room allocation completed", detail: "Room B-216 assigned to a student", time: "10 min ago" },
  { icon: ClipboardList, color: "activity-blue", title: "New maintenance request", detail: "Water leakage · Boys Block", time: "32 min ago" },
  { icon: Wallet, color: "activity-purple", title: "Fee payment received", detail: "Mess fee · ₹4,500", time: "1 hour ago" },
  { icon: CalendarDays, color: "activity-orange", title: "Leave request submitted", detail: "Weekend leave · Girls Block", time: "2 hours ago" },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [block, setBlock] = useState("All Blocks");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const menuItems = navigation.flatMap(section => section.items);
  const selectedItem = menuItems.find(item => item.label === active);
  const visibleComplaints = complaints.filter(item =>
    `${item.title} ${item.room} ${item.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Building2 size={23} strokeWidth={2.2} /></div>
          <div><div className="brand-name">Smart<span>Hostel</span></div><div className="brand-caption">HOSTEL MANAGEMENT</div></div>
          <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={19} /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <button className="block-select" onClick={() => setBlock(block === "All Blocks" ? "Boys Block" : block === "Boys Block" ? "Girls Block" : "All Blocks")}>
          <span className="block-icon"><Building2 size={17} /></span>
          <span className="block-text"><strong>{block}</strong><small>Hostel campus</small></span>
          <ChevronDown size={16} />
        </button>

        <nav className="sidebar-nav">
          {navigation.map(section => (
            <div className="nav-section" key={section.title}>
              <div className="nav-heading">{section.title}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                return <button key={item.label} className={`nav-item ${active === item.label ? "nav-active" : ""}`} onClick={() => { setActive(item.label); setMobileOpen(false); }}>
                  <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>
                  {item.label === "Complaints" && <span className="nav-count">24</span>}
                </button>;
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-promo">
            <div className="ai-promo-icon"><Sparkles size={17} /></div>
            <strong>Meet your AI assistant</strong>
            <p>Get quick answers and smarter hostel insights.</p>
            <button onClick={() => setActive("AI Assistant")}>Explore assistant <ArrowUpRight size={14} /></button>
          </div>
          <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
          <div className="profile-mini">
            <div className="profile-avatar">SA</div>
            <div className="profile-details"><strong>Hostel Admin</strong><small>Administrator</small></div>
            <LogOut size={17} className="logout-icon" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." /><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="topbar-divider" />
            <div className="admin-profile"><div className="profile-avatar">SA</div><div><strong>Sirivalli</strong><small>Hostel Admin</small></div><ChevronDown size={15} /></div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div><div className="eyebrow"><span className="live-dot" /> CAMPUS OVERVIEW</div><h1>{active === "Dashboard" ? "Good morning, Sirivalli" : active}</h1><p className="welcome-subtitle">{active === "Dashboard" ? "Here's what's happening across your hostel campus today." : `Manage and review ${active.toLowerCase()} across your hostel campus.`}</p></div>
            <div className="welcome-actions"><button className="date-chip"><CalendarDays size={16} /> October 11, 2026</button><button className="primary-button" onClick={() => setActive("Students")}><Plus size={17} /> Quick action</button></div>
          </div>

          <div className="notice-strip"><div className="notice-icon"><Sparkles size={17} /></div><div><strong>Your campus at a glance</strong><p>Review hostel operations, student services and pending tasks from one place.</p></div><button onClick={() => setActive("Announcements")}>View updates <ArrowUpRight size={15} /></button></div>

          <div className="section-heading"><div><h2>Campus overview</h2><p>Key performance indicators for your hostel</p></div><button className="text-button" onClick={() => setBlock(block === "All Blocks" ? "Boys Block" : block === "Boys Block" ? "Girls Block" : "All Blocks")}>{block} <ChevronDown size={15} /></button></div>

          <div className="stats-grid">
            {stats.map(stat => { const Icon = stat.icon; return <div className="stat-card" key={stat.label}>
              <div className="stat-top"><span>{stat.label}</span><span className={`stat-icon icon-${stat.color}`}><Icon size={19} /></span></div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-bottom"><span className={`change ${stat.label === "Open Complaints" ? "change-good" : "change-up"}`}>{stat.label === "Open Complaints" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{stat.change}</span><span>{stat.note}</span></div>
            </div>; })}
          </div>

          <div className="dashboard-grid">
            <section className="panel occupancy-panel">
              <div className="panel-heading"><div><h3>Room occupancy</h3><p>Bed utilization across hostel blocks</p></div><button className="more-button" onClick={() => setActive("Rooms & Beds")}>View details <ArrowUpRight size={15} /></button></div>
              <div className="occupancy-total"><div><strong>846 <span>/ 1,000 beds</span></strong><p>Currently occupied</p></div><span className="occupancy-percent">84.6%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{width:"84.6%"}} /></div>
              <div className="block-occupancy">
                <div className="block-row"><div className="block-dot dot-teal" /><div className="block-info"><strong>Boys Block</strong><small>510 total beds</small></div><div className="block-numbers"><strong>438</strong><small>occupied</small></div><span className="mini-percent">85.9%</span></div>
                <div className="block-row"><div className="block-dot dot-purple" /><div className="block-info"><strong>Girls Block</strong><small>490 total beds</small></div><div className="block-numbers"><strong>408</strong><small>occupied</small></div><span className="mini-percent">83.3%</span></div>
              </div>
              <div className="occupancy-footer"><span><i className="legend-dot occupied-dot" /> Occupied</span><span><i className="legend-dot available-dot" /> Available</span><span><i className="legend-dot maintenance-dot" /> Maintenance</span></div>
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading"><div><h3>Recent activity</h3><p>Latest campus updates</p></div><button className="dots-button" aria-label="Activity options">•••</button></div>
              <div className="activity-list">{activity.map((item, index) => { const Icon = item.icon; return <div className="activity-item" key={item.title}><div className={`activity-icon ${item.color}`}><Icon size={17} /></div><div className="activity-content"><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div>{index === 0 && <span className="activity-new" />}</div>; })}</div>
              <button className="activity-footer" onClick={() => setActive("Announcements")}>View all activity <ArrowUpRight size={15} /></button>
            </section>
          </div>

          <section className="panel complaints-panel">
            <div className="panel-heading"><div><h3>Recent complaints</h3><p>Track and manage maintenance requests</p></div><button className="more-button" onClick={() => setActive("Complaints")}>View all complaints <ArrowUpRight size={15} /></button></div>
            <div className="table-wrap"><table><thead><tr><th>COMPLAINT</th><th>CATEGORY</th><th>PRIORITY</th><th>STATUS</th><th /></tr></thead><tbody>
              {visibleComplaints.map(item => <tr key={item.title}><td><div className="complaint-title"><div className={`complaint-avatar ${item.color}`}>{item.initials}</div><div><strong>{item.title}</strong><small>{item.room}</small></div></div></td><td><span className="category-text">{item.category}</span></td><td><span className={`priority priority-${item.priority.toLowerCase()}`}><i />{item.priority}</span></td><td><span className={`status status-${item.status.toLowerCase().replace(" ","-")}`}>{item.status}</span></td><td><button className="row-action" aria-label={`View ${item.title}`} onClick={() => setActive("Complaints")}>•••</button></td></tr>)}
              {visibleComplaints.length === 0 && <tr><td colSpan="5" className="empty-state">No matching complaints found.</td></tr>}
            </tbody></table></div>
            <div className="table-footer"><span>Showing {visibleComplaints.length} of {complaints.length} sample complaints</span><button onClick={() => setSearch("")}>Clear search <X size={13} /></button></div>
          </section>

          <footer className="page-footer"><span>© 2026 SmartHostel</span><span><ShieldCheck size={14} /> Built for smarter campus living</span><span>Help & support <MessageSquare size={14} /></span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
