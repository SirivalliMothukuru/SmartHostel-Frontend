
import { useEffect, useState } from "react";
import {
  Home,
  BedDouble,
  Wallet,
  Utensils,
  ClipboardList,
  LogOut,
  Bell,
  Wrench,
  CalendarDays,
  RefreshCw,
  UserRoundPen,
  Save,
  X,
  CheckCircle,
  Building2,
  DoorOpen,
  Layers3,
  IndianRupee,
  Clock,
  CircleCheck,
  Send,
  AlertCircle,
  FileText,
  Camera,
  ImagePlus,
  MapPin,
  Sparkles
} from "lucide-react";
import api from "../api";

function StudentDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [profile, setProfile] = useState(null);
  const [room, setRoom] = useState(null);
  const [fees, setFees] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [loading, setLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);
  const [feesLoading, setFeesLoading] = useState(false);
  const [messLoading, setMessLoading] = useState(false);

  const [roomError, setRoomError] = useState("");
  const [feesError, setFeesError] = useState("");
  const [messError, setMessError] = useState("");
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);
  const [complaintError, setComplaintError] = useState("");
  const [complaintSuccess, setComplaintSuccess] = useState("");

  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "PLUMBING",
    description: "",
    priority: "MEDIUM"
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState("");

  const [leaveForm, setLeaveForm] = useState({
    reason: "",
    description: "",
    fromDate: "",
    toDate: ""
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    rollNumber: ""
  });

  const [snaps, setSnaps] = useState([]);
  const [snapImage, setSnapImage] = useState("");
  const [snapTitle, setSnapTitle] = useState("");
  const [snapCategory, setSnapCategory] = useState("PLUMBING");
  const [snapLocation, setSnapLocation] = useState("");
  const [snapDescription, setSnapDescription] = useState("");
  const [snapMessage, setSnapMessage] = useState("");
  const [snapError, setSnapError] = useState("");
  const [snapSubmitting, setSnapSubmitting] = useState(false);
  const [snapLoading, setSnapLoading] = useState(false);

  const block = localStorage.getItem("block") || "Not assigned";
  const email = profile?.email || localStorage.getItem("email") || "Student";
  const studentName = profile?.name || email.split("@")[0];
  const initial = studentName.charAt(0).toUpperCase() || "S";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No login token found. Please log in again.");
        return;
      }

      const response = await api.get("/api/student/profile");

      if (!response.data || !response.data.email) {
        throw new Error("Invalid student profile response");
      }

      setProfile(response.data);
      setForm({
        name: response.data.name || "",
        phone: response.data.phone || "",
        rollNumber: response.data.rollNumber || ""
      });

      const assignedBlock =
        response.data.hostelBlock || response.data.block;

      if (assignedBlock) {
        localStorage.setItem("block", assignedBlock);
      }
    } catch (err) {
      console.error("Profile loading failed:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("Student profile not found in the database.");
      } else if (!err.response) {
        setError("Cannot connect to the backend. Check that Spring Boot is running.");
      } else {
        setError("Unable to load your profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoom = async () => {
    try {
      setRoomLoading(true);
      setRoomError("");
      const response = await api.get("/api/student/room");
      setRoom(response.data);
    } catch (err) {
      console.error("Room loading failed:", err);

      if (err.response?.status === 404) {
        setRoom(null);
        setRoomError(
          "No room has been allocated to you yet. Please contact your hostel administrator."
        );
      } else if (err.response?.status === 401) {
        setRoomError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setRoomError("Access denied. Please log in again.");
      } else if (!err.response) {
        setRoomError("Cannot connect to the backend. Check that Spring Boot is running.");
      } else {
        setRoomError("Unable to load room details. Please try again.");
      }
    } finally {
      setRoomLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      setFeesLoading(true);
      setFeesError("");
      const response = await api.get("/api/student/fees");
      setFees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fees loading failed:", err);

      if (err.response?.status === 401) {
        setFeesError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setFeesError("Access denied. Please log in again.");
      } else if (!err.response) {
        setFeesError("Cannot connect to the backend. Check that Spring Boot is running.");
      } else {
        setFeesError("Unable to load your fee details. Please try again.");
      }
    } finally {
      setFeesLoading(false);
    }
  };

  const fetchMessMenu = async () => {
    try {
      setMessLoading(true);
      setMessError("");
      const response = await api.get("/api/student/mess-menu");
      setMessMenu(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Mess menu loading failed:", err);

      if (err.response?.status === 401) {
        setMessError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setMessError("Access denied. Please log in again.");
      } else if (!err.response) {
        setMessError("Cannot connect to the backend. Check that Spring Boot is running.");
      } else {
        setMessError("Unable to load the mess menu. Please try again.");
      }
    } finally {
      setMessLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setComplaintLoading(true);
      setComplaintError("");
      const response = await api.get("/api/student/complaints");
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Complaint loading failed:", err);
      setComplaintError(
        err.response?.data?.message ||
          "Unable to load complaints. Please try again."
      );
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleComplaintChange = (event) => {
    const { name, value } = event.target;
    setComplaintForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();

    try {
      setComplaintSubmitting(true);
      setComplaintError("");
      setComplaintSuccess("");

      await api.post("/api/student/complaints", {
        title: complaintForm.title.trim(),
        category: complaintForm.category,
        description: complaintForm.description.trim(),
        priority: complaintForm.priority
      });

      setComplaintForm({
        title: "",
        category: "PLUMBING",
        description: "",
        priority: "MEDIUM"
      });

      setComplaintSuccess("Your complaint was submitted successfully.");
      await fetchComplaints();
    } catch (err) {
      console.error("Complaint submission failed:", err);
      setComplaintError(
        err.response?.data?.message ||
          "Unable to submit your complaint. Please try again."
      );
    } finally {
      setComplaintSubmitting(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLeaveLoading(true);
      setLeaveError("");
      const response = await api.get("/api/student/leave-requests");
      setLeaveRequests(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Leave requests loading failed:", err);
      setLeaveError(
        err.response?.data?.message ||
          "Unable to load leave requests. Please try again."
      );
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleLeaveChange = (event) => {
    const { name, value } = event.target;
    setLeaveForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleLeaveSubmit = async (event) => {
    event.preventDefault();
    setLeaveError("");
    setLeaveSuccess("");

    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (leaveForm.fromDate < localToday) {
      setLeaveError("Start date cannot be in the past.");
      return;
    }

    if (leaveForm.toDate < leaveForm.fromDate) {
      setLeaveError("End date cannot be before start date.");
      return;
    }

    try {
      setLeaveSubmitting(true);

      await api.post("/api/student/leave-requests", {
        reason: leaveForm.reason.trim(),
        description: leaveForm.description.trim(),
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate
      });

      setLeaveForm({
        reason: "",
        description: "",
        fromDate: "",
        toDate: ""
      });

      setLeaveSuccess("Your leave request was submitted successfully.");
      await fetchLeaveRequests();
    } catch (err) {
      console.error("Leave request submission failed:", err);
      setLeaveError(
        err.response?.data?.message ||
          "Unable to submit your leave request. Please try again."
      );
    } finally {
      setLeaveSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activePage === "My Room") fetchRoom();
    if (activePage === "Fees") fetchFees();
    if (activePage === "Mess Menu") fetchMessMenu();

    if (activePage === "Complaints") {
      setComplaintSuccess("");
      fetchComplaints();
    }

    if (activePage === "Leave Requests") {
      setLeaveSuccess("");
      fetchLeaveRequests();
    }

    if (activePage === "HostelSnap AI") {
      setSnapMessage("");
      fetchSnaps();
    }
  }, [activePage]);

  const handleFormChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/api/student/profile", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        rollNumber: form.rollNumber.trim()
      });

      setProfile(response.data);
      setForm({
        name: response.data.name || "",
        phone: response.data.phone || "",
        rollNumber: response.data.rollNumber || ""
      });

      setEditing(false);
      setSuccess("Your profile was updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("Student profile not found.");
      } else {
        setError("Unable to update your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "Not available";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return String(date);

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatShortDate = (date) => {
    if (!date) return "Not specified";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const totalFees = fees.reduce(
    (total, fee) => total + (Number(fee.amount) || 0),
    0
  );

  const totalPaid = fees.reduce(
    (total, fee) => total + (Number(fee.amountPaid) || 0),
    0
  );

  const totalPending = Math.max(totalFees - totalPaid, 0);
  const mealOrder = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  const todaysMenu = messMenu
    .filter((meal) => meal.day?.toLowerCase() === selectedDay.toLowerCase())
    .sort(
      (a, b) =>
        mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType)
    );

  const items = [
    { name: "Dashboard", icon: Home },
    { name: "My Room", icon: BedDouble },
    { name: "Fees", icon: Wallet },
    { name: "Mess Menu", icon: Utensils },
    { name: "Complaints", icon: Wrench },
    { name: "Leave Requests", icon: CalendarDays },
    { name: "My Requests", icon: ClipboardList },
    { name: "HostelSnap AI", icon: Camera }
  ];

  const fetchSnaps = async () => {
    try {
      setSnapLoading(true);
      setSnapError("");

      const currentBlock = localStorage.getItem("block") || "Not assigned";

      if (!currentBlock || currentBlock === "Not assigned") {
        setSnaps([]);
        setSnapError("Your hostel block is not assigned. Please contact your warden.");
        return;
      }

      const response = await api.get("/api/snaps", {
        params: { block: currentBlock }
      });

      setSnaps(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Snap loading failed:", err);
      setSnapError(
        err.response?.data?.message ||
          "Unable to load Snaps. Check that the backend is running."
      );
    } finally {
      setSnapLoading(false);
    }
  };

  const handleSnapSubmit = async (event) => {
    event.preventDefault();
    setSnapError("");
    setSnapMessage("");

    if (!snapImage) {
      setSnapError("Please upload a photo of the problem.");
      return;
    }

    if (
      !snapTitle.trim() ||
      !snapLocation.trim() ||
      !snapDescription.trim()
    ) {
      setSnapError("Please complete all required fields.");
      return;
    }

    if (!profile?.id) {
      setSnapError("Student profile is not loaded. Please try again.");
      return;
    }

    const currentBlock = localStorage.getItem("block") || "Not assigned";

    if (currentBlock === "Not assigned") {
      setSnapError("Your hostel block is not assigned. Please contact your warden.");
      return;
    }

    try {
      setSnapSubmitting(true);

      const response = await api.post("/api/snaps", {
        studentId: profile.id,
        title: snapTitle.trim(),
        category: snapCategory,
        location: snapLocation.trim(),
        description: snapDescription.trim(),
        imageData: snapImage,
        hostelBlock: currentBlock
      });

      setSnaps((previous) => [response.data, ...previous]);

      setSnapImage("");
      setSnapTitle("");
      setSnapCategory("PLUMBING");
      setSnapLocation("");
      setSnapDescription("");
      setSnapMessage("Your Snap was saved successfully.");
    } catch (err) {
      console.error("Snap submission failed:", err);
      setSnapError(
        err.response?.data?.message ||
          "Unable to save your Snap. Please try again."
      );
    } finally {
      setSnapSubmitting(false);
    }
  };

  const handleSnapImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnapError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnapError("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSnapImage(String(reader.result || ""));
      setSnapError("");
      setSnapMessage("");
    };

    reader.onerror = () => {
      setSnapError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  };

  const renderHostelSnap = () => (
    <div className="hostelsnap-page">
      <section className="student-welcome">
        <div>
          <p>SEE IT. SNAP IT. FIX IT.</p>
          <h1>HostelSnap AI</h1>
          <span>Capture hostel problems and help improve your hostel.</span>
        </div>
        <Camera size={55} />
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>Report a Problem</h3>
            <p>Upload a photo and tell hostel staff what needs attention.</p>
          </div>
          <Sparkles size={25} />
        </div>

        {snapMessage && (
          <p className="profile-success" role="status">
            <CheckCircle size={17} /> {snapMessage}
          </p>
        )}

        {snapError && (
          <p className="profile-error" role="alert">
            <AlertCircle size={17} /> {snapError}
          </p>
        )}

        <form className="edit-profile-form" onSubmit={handleSnapSubmit}>
          <label htmlFor="snap-photo">Problem Photo</label>

          <label className="snap-upload" htmlFor="snap-photo">
            {snapImage ? (
              <img src={snapImage} alt="Preview of the hostel problem" />
            ) : (
              <>
                <ImagePlus size={38} />
                <strong>Upload or capture a photo</strong>
                <span>Image formats supported · Max 5 MB</span>
              </>
            )}
          </label>

          <input
            id="snap-photo"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleSnapImage}
          />

          {snapImage && (
            <button type="button" onClick={() => setSnapImage("")}>
              <X size={16} /> Remove Photo
            </button>
          )}

          <label htmlFor="snap-title">Problem Title</label>
          <input
            id="snap-title"
            value={snapTitle}
            onChange={(event) => setSnapTitle(event.target.value)}
            placeholder="Example: Water leaking from tap"
            maxLength={100}
            required
          />

          <label htmlFor="snap-category">Category</label>
          <select
            id="snap-category"
            value={snapCategory}
            onChange={(event) => setSnapCategory(event.target.value)}
            required
          >
            <option value="PLUMBING">Water / Plumbing</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="CLEANLINESS">Cleanliness</option>
            <option value="MAINTENANCE">Room Maintenance</option>
            <option value="MESS">Mess / Food</option>
            <option value="LAUNDRY">Laundry</option>
            <option value="INTERNET">Internet / Wi-Fi</option>
            <option value="SECURITY">Security</option>
            <option value="OTHER">Other</option>
          </select>

          <label htmlFor="snap-location">Location</label>
          <input
            id="snap-location"
            value={snapLocation}
            onChange={(event) => setSnapLocation(event.target.value)}
            placeholder="Example: Floor 2, bathroom"
            maxLength={255}
            required
          />

          <label htmlFor="snap-description">Description</label>
          <textarea
            id="snap-description"
            value={snapDescription}
            onChange={(event) => setSnapDescription(event.target.value)}
            placeholder="Describe the problem and what needs fixing..."
            rows={4}
            maxLength={2000}
            required
          />

          <p><strong>Your Block:</strong> {localStorage.getItem("block") || "Not assigned"}</p>

          <div className="profile-form-actions">
            <button type="submit" disabled={snapSubmitting}>
              <Camera size={17} />
              {snapSubmitting ? "Posting..." : "Post Snap"}
            </button>

            <button
              type="button"
              disabled={snapSubmitting}
              onClick={() => {
                setSnapImage("");
                setSnapTitle("");
                setSnapCategory("PLUMBING");
                setSnapLocation("");
                setSnapDescription("");
                setSnapError("");
                setSnapMessage("");
              }}
            >
              <X size={17} /> Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>Hostel Problem Feed</h3>
            <p>Reports submitted in your hostel block.</p>
          </div>

          <button type="button" onClick={fetchSnaps} disabled={snapLoading}>
            <RefreshCw size={16} />
            {snapLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {snapLoading ? (
          <p>Loading hostel reports...</p>
        ) : snaps.length === 0 ? (
          <div className="hostelsnap-empty">
            <ImagePlus size={42} />
            <h3>No snaps yet</h3>
            <p>No reports are available for this block yet.</p>
          </div>
        ) : (
          <div className="hostelsnap-feed">
            {snaps.map((snap) => (
              <article className="hostelsnap-card" key={snap.id}>
                {(snap.imageData || snap.image) && (
                  <img
                    src={snap.imageData || snap.image}
                    alt={snap.title || "Hostel problem"}
                  />
                )}

                <div className="hostelsnap-card-content">
                  <div className="hostelsnap-card-top">
                    <span className="hostelsnap-category">
                      {snap.category || "OTHER"}
                    </span>
                    <span className="fee-status pending">
                      {snap.status || "PENDING"}
                    </span>
                  </div>

                  <h3>{snap.title}</h3>
                  <p className="hostelsnap-location">
                    <MapPin size={16} /> {snap.location}
                  </p>
                  <p>{snap.description}</p>
                  <p>
                    <strong>Block:</strong>{" "}
                    {snap.hostelBlock || snap.block || block}
                  </p>
                  <small>{formatDate(snap.createdAt)}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderComplaints = () => (
    <>
      <section className="student-welcome">
        <div>
          <p>HOSTEL SUPPORT</p>
          <h1>Complaints</h1>
          <span>Report hostel issues and track their progress.</span>
        </div>
        <Wrench size={55} />
      </section>

      <section className="student-stats">
        <article className="student-stat-card">
          <FileText />
          <p>Total Complaints</p>
          <h3>{complaints.length}</h3>
        </article>
        <article className="student-stat-card">
          <Clock />
          <p>Pending</p>
          <h3>{complaints.filter((item) => item.status?.toUpperCase() === "PENDING").length}</h3>
        </article>
        <article className="student-stat-card">
          <CheckCircle />
          <p>Resolved</p>
          <h3>{complaints.filter((item) => item.status?.toUpperCase() === "RESOLVED").length}</h3>
        </article>
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>Raise a Complaint</h3>
            <p>Describe the problem so hostel staff can assist you.</p>
          </div>
          <Wrench size={24} />
        </div>

        {complaintSuccess && (
          <p className="profile-success" role="status">
            <CheckCircle size={17} /> {complaintSuccess}
          </p>
        )}

        {complaintError && (
          <p className="profile-error" role="alert">
            <AlertCircle size={17} /> {complaintError}
          </p>
        )}

        <form className="edit-profile-form" onSubmit={handleComplaintSubmit}>
          <label htmlFor="complaint-title">Complaint Title</label>
          <input
            id="complaint-title"
            name="title"
            value={complaintForm.title}
            onChange={handleComplaintChange}
            placeholder="Example: Water supply problem"
            maxLength={100}
            required
          />

          <label htmlFor="complaint-category">Category</label>
          <select
            id="complaint-category"
            name="category"
            value={complaintForm.category}
            onChange={handleComplaintChange}
            required
          >
            <option value="PLUMBING">Plumbing / Water</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="CLEANLINESS">Cleanliness</option>
            <option value="MAINTENANCE">Room Maintenance</option>
            <option value="MESS">Mess / Food</option>
            <option value="LAUNDRY">Laundry</option>
            <option value="INTERNET">Internet / Wi-Fi</option>
            <option value="SECURITY">Security</option>
            <option value="OTHER">Other</option>
          </select>

          <label htmlFor="complaint-description">Description</label>
          <textarea
            id="complaint-description"
            name="description"
            value={complaintForm.description}
            onChange={handleComplaintChange}
            placeholder="Explain the issue and where it occurred..."
            rows={5}
            maxLength={2000}
            required
          />

          <label htmlFor="complaint-priority">Priority</label>
          <select
            id="complaint-priority"
            name="priority"
            value={complaintForm.priority}
            onChange={handleComplaintChange}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <div className="profile-form-actions">
            <button type="submit" disabled={complaintSubmitting}>
              <Send size={17} />
              {complaintSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
            <button
              type="button"
              disabled={complaintSubmitting}
              onClick={() => {
                setComplaintForm({
                  title: "",
                  category: "PLUMBING",
                  description: "",
                  priority: "MEDIUM"
                });
                setComplaintError("");
                setComplaintSuccess("");
              }}
            >
              <X size={17} /> Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>My Complaint History</h3>
            <p>Track the status of complaints submitted from your account.</p>
          </div>
          <button onClick={fetchComplaints} disabled={complaintLoading}>
            <RefreshCw size={16} />
            {complaintLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {complaintLoading ? (
          <p>Loading your complaints...</p>
        ) : complaints.length === 0 ? (
          <p>You haven't submitted any complaints yet.</p>
        ) : (
          <div className="complaint-list">
            {complaints.map((complaint) => {
              const status = (complaint.status || "PENDING").toUpperCase();
              const priority = (complaint.priority || "MEDIUM").toUpperCase();

              return (
                <article className="fee-card" key={complaint.id}>
                  <div className="fee-card-heading">
                    <div className="fee-icon"><Wrench size={22} /></div>
                    <div>
                      <h3>{complaint.title}</h3>
                      <p>Complaint ID: {complaint.id}</p>
                    </div>
                    <span className={`fee-status ${status === "RESOLVED" || status === "CLOSED" ? "paid" : "pending"}`}>
                      {status}
                    </span>
                  </div>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  <p><strong>Priority:</strong> {priority}</p>
                  <p><strong>Hostel Block:</strong> {complaint.hostelBlock}</p>
                  <p><strong>Submitted:</strong> {formatDate(complaint.createdAt)}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );

  const renderLeaveRequests = () => (
    <>
      <section className="student-welcome">
        <div>
          <p>LEAVE MANAGEMENT</p>
          <h1>Leave Requests</h1>
          <span>Apply for leave and track your application status.</span>
        </div>
        <CalendarDays size={55} />
      </section>

      <section className="student-stats">
        <article className="student-stat-card">
          <FileText />
          <p>Total Requests</p>
          <h3>{leaveRequests.length}</h3>
        </article>
        <article className="student-stat-card">
          <Clock />
          <p>Pending</p>
          <h3>{leaveRequests.filter((item) => item.status?.toUpperCase() === "PENDING").length}</h3>
        </article>
        <article className="student-stat-card">
          <CheckCircle />
          <p>Approved</p>
          <h3>{leaveRequests.filter((item) => item.status?.toUpperCase() === "APPROVED").length}</h3>
        </article>
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>Apply for Leave</h3>
            <p>Enter the reason and dates for your leave.</p>
          </div>
          <CalendarDays size={24} />
        </div>

        {leaveSuccess && (
          <p className="profile-success" role="status">
            <CheckCircle size={17} /> {leaveSuccess}
          </p>
        )}
        {leaveError && (
          <p className="profile-error" role="alert">
            <AlertCircle size={17} /> {leaveError}
          </p>
        )}

        <form className="edit-profile-form" onSubmit={handleLeaveSubmit}>
          <label htmlFor="leave-reason">Reason for Leave</label>
          <select id="leave-reason" name="reason" value={leaveForm.reason} onChange={handleLeaveChange} required>
            <option value="">Select a reason</option>
            <option value="Going home">Going home</option>
            <option value="Family function">Family function</option>
            <option value="Medical appointment">Medical appointment</option>
            <option value="Personal work">Personal work</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="leave-description">Description</label>
          <textarea id="leave-description" name="description" value={leaveForm.description} onChange={handleLeaveChange} placeholder="Explain why you need leave..." rows={4} maxLength={500} required />

          <label htmlFor="leave-from-date">From Date</label>
          <input id="leave-from-date" type="date" name="fromDate" value={leaveForm.fromDate} onChange={handleLeaveChange} min={(() => {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          })()} required />

          <label htmlFor="leave-to-date">To Date</label>
          <input id="leave-to-date" type="date" name="toDate" value={leaveForm.toDate} onChange={handleLeaveChange} min={leaveForm.fromDate || undefined} required />

          <div className="profile-form-actions">
            <button type="submit" disabled={leaveSubmitting}>
              <Send size={17} /> {leaveSubmitting ? "Submitting..." : "Submit Leave Request"}
            </button>
            <button type="button" disabled={leaveSubmitting} onClick={() => {
              setLeaveForm({ reason: "", description: "", fromDate: "", toDate: "" });
              setLeaveError("");
              setLeaveSuccess("");
            }}>
              <X size={17} /> Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="student-info-card">
        <div className="profile-heading">
          <div>
            <h3>My Leave History</h3>
            <p>Review the leave applications linked to your account.</p>
          </div>
          <button onClick={fetchLeaveRequests} disabled={leaveLoading}>
            <RefreshCw size={16} /> {leaveLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {leaveLoading ? (
          <p>Loading your leave requests...</p>
        ) : leaveRequests.length === 0 ? (
          <p>You haven't submitted any leave requests yet.</p>
        ) : (
          <div className="complaint-list">
            {leaveRequests.map((request) => {
              const status = (request.status || "PENDING").toUpperCase();

              return (
                <article className="fee-card" key={request.id}>
                  <div className="fee-card-heading">
                    <div className="fee-icon"><CalendarDays size={22} /></div>
                    <div>
                      <h3>{request.reason}</h3>
                      <p>Request ID: {request.id}</p>
                    </div>
                    <span className={`fee-status ${status === "APPROVED" ? "paid" : "pending"}`}>
                      {status}
                    </span>
                  </div>
                  <p><strong>Description:</strong> {request.description}</p>
                  <p><strong>From:</strong> {formatShortDate(request.fromDate)}</p>
                  <p><strong>To:</strong> {formatShortDate(request.toDate)}</p>
                  <p><strong>Hostel Block:</strong> {request.hostelBlock}</p>
                  <p><strong>Submitted:</strong> {formatDate(request.createdAt)}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );

  return (
    <div className="student-dashboard">
      <aside className="student-sidebar">
        <h2>SmartHostel</h2>
        <p className="student-sidebar-label">STUDENT PORTAL</p>

        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`student-nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}

        <button className="student-logout" onClick={onLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="student-main">
        <header className="student-topbar">
          <div>
            <p>STUDENT WORKSPACE</p>
            <h2>{activePage}</h2>
          </div>
          <div className="student-profile">
            <Bell size={20} />
            <div className="student-avatar">{initial}</div>
            <span>{email}</span>
          </div>
        </header>

        {loading ? (
          <section className="student-info-card">
            <h3>Loading your profile...</h3>
            <p>Please wait while we retrieve your details.</p>
          </section>
        ) : error && !profile ? (
          <section className="student-info-card">
            <h3>Profile unavailable</h3>
            <p>{error}</p>
            <button onClick={fetchProfile} disabled={loading}>
              <RefreshCw size={16} /> Try Again
            </button>
            <button onClick={onLogout}>
              <LogOut size={16} /> Return to Login
            </button>
          </section>
        ) : (
          <>
            {activePage === "Dashboard" && (
              <>
                <section className="student-welcome">
                  <div>
                    <p>YOUR HOSTEL, ONE PLACE</p>
                    <h1>Welcome back, {studentName}!</h1>
                    <span>Manage your hostel life from one simple dashboard.</span>
                  </div>
                  <Home size={55} />
                </section>

                <section className="student-stats">
                  <article className="student-stat-card">
                    <BedDouble /><p>My Block</p><h3>{block}</h3>
                  </article>
                  <article className="student-stat-card">
                    <Wallet /><p>Phone Number</p><h3>{profile.phone || "Not added"}</h3>
                  </article>
                  <article className="student-stat-card">
                    <Wrench /><p>Roll Number</p><h3>{profile.rollNumber || "Not added"}</h3>
                  </article>
                  <article className="student-stat-card">
                    <CalendarDays /><p>Student ID</p><h3>{profile.id}</h3>
                  </article>
                </section>

                <section className="student-info-card">
                  <div className="profile-heading">
                    <h3>My Profile</h3>
                    {!editing && (
                      <button onClick={() => {
                        setForm({
                          name: profile.name || "",
                          phone: profile.phone || "",
                          rollNumber: profile.rollNumber || ""
                        });
                        setError("");
                        setSuccess("");
                        setEditing(true);
                      }}>
                        <UserRoundPen size={17} /> Edit Profile
                      </button>
                    )}
                  </div>

                  {success && <p className="profile-success"><CheckCircle size={17} /> {success}</p>}
                  {error && <p className="profile-error">{error}</p>}

                  {editing ? (
                    <form onSubmit={handleSaveProfile} className="edit-profile-form">
                      <label htmlFor="profile-name">Full Name</label>
                      <input id="profile-name" name="name" value={form.name} onChange={handleFormChange} required maxLength={100} />

                      <label htmlFor="profile-email">Email</label>
                      <input id="profile-email" value={profile.email} disabled />

                      <label htmlFor="profile-phone">Phone Number</label>
                      <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={handleFormChange} maxLength={20} />

                      <label htmlFor="profile-roll">Roll Number</label>
                      <input id="profile-roll" name="rollNumber" value={form.rollNumber} onChange={handleFormChange} maxLength={30} />

                      <div className="profile-form-actions">
                        <button type="submit" disabled={saving}><Save size={17} /> {saving ? "Saving..." : "Save Changes"}</button>
                        <button type="button" disabled={saving} onClick={() => {
                          setEditing(false);
                          setError("");
                          setForm({
                            name: profile.name || "",
                            phone: profile.phone || "",
                            rollNumber: profile.rollNumber || ""
                          });
                        }}><X size={17} /> Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p><strong>Name:</strong> {profile.name}</p>
                      <p><strong>Email:</strong> {profile.email}</p>
                      <p><strong>Phone:</strong> {profile.phone || "Not added"}</p>
                      <p><strong>Roll Number:</strong> {profile.rollNumber || "Not added"}</p>
                      <p><strong>Hostel Block:</strong> {block}</p>
                    </>
                  )}

                  <h3>Quick Access</h3>
                  <p>Choose a service from the sidebar to manage your hostel activities.</p>
                  <div className="student-quick-actions">
                    <button onClick={() => setActivePage("My Room")}><BedDouble size={20} /> View My Room</button>
                    <button onClick={() => setActivePage("Fees")}><Wallet size={20} /> View Fees</button>
                    <button onClick={() => setActivePage("Mess Menu")}><Utensils size={20} /> View Mess Menu</button>
                    <button onClick={() => setActivePage("Complaints")}><Wrench size={20} /> Raise a Complaint</button>
                    <button onClick={() => setActivePage("Leave Requests")}><CalendarDays size={20} /> Request Leave</button>
                    <button onClick={() => setActivePage("HostelSnap AI")}><Camera size={20} /> Open HostelSnap AI</button>
                  </div>
                </section>
              </>
            )}

            {activePage === "My Room" && (
              <section className="student-info-card">
                <div className="profile-heading">
                  <div><p>YOUR HOSTEL ACCOMMODATION</p><h3>My Room Details</h3></div>
                  <button onClick={fetchRoom} disabled={roomLoading}><RefreshCw size={16} /> {roomLoading ? "Refreshing..." : "Refresh"}</button>
                </div>

                {roomLoading ? <p>Loading your room allocation...</p> : roomError ? (
                  <div><p className="profile-error">{roomError}</p><button onClick={fetchRoom}><RefreshCw size={16} /> Try Again</button></div>
                ) : room ? (
                  <>
                    <div className="student-stats">
                      <article className="student-stat-card"><Building2 /><p>Hostel Block</p><h3>{room.hostelBlock}</h3></article>
                      <article className="student-stat-card"><DoorOpen /><p>Room Number</p><h3>{room.roomNumber}</h3></article>
                      <article className="student-stat-card"><Layers3 /><p>Floor</p><h3>{room.floor}</h3></article>
                      <article className="student-stat-card"><BedDouble /><p>Bed Number</p><h3>{room.bedNumber}</h3></article>
                    </div>
                    <div className="room-detail-list">
                      <p><strong>Room Type:</strong> {room.roomType}</p>
                      <p><strong>Allocation Status:</strong> <span className="room-status">{room.status}</span></p>
                      <p><strong>Student ID:</strong> {room.studentId}</p>
                    </div>
                  </>
                ) : <p>No room details are available.</p>}
              </section>
            )}

            {activePage === "Fees" && (
              <>
                <section className="student-welcome">
                  <div><p>YOUR HOSTEL ACCOUNT</p><h1>Fees Management</h1><span>View your hostel fees, payments, and due dates.</span></div>
                  <Wallet size={55} />
                </section>

                <section className="student-stats">
                  <article className="student-stat-card"><IndianRupee /><p>Total Fees</p><h3>{formatCurrency(totalFees)}</h3></article>
                  <article className="student-stat-card"><CircleCheck /><p>Amount Paid</p><h3>{formatCurrency(totalPaid)}</h3></article>
                  <article className="student-stat-card"><Clock /><p>Pending Amount</p><h3>{formatCurrency(totalPending)}</h3></article>
                </section>

                <section className="student-info-card">
                  <div className="profile-heading">
                    <div><h3>My Fee Details</h3><p>Fee records linked to your student account.</p></div>
                    <button onClick={fetchFees} disabled={feesLoading}><RefreshCw size={16} /> {feesLoading ? "Refreshing..." : "Refresh"}</button>
                  </div>

                  {feesLoading ? <p>Loading your fee details...</p> : feesError ? (
                    <div><p className="profile-error">{feesError}</p><button onClick={fetchFees}><RefreshCw size={16} /> Try Again</button></div>
                  ) : fees.length === 0 ? <p>No fee records are available for your account.</p> : (
                    <div className="fees-list">
                      {fees.map((fee) => {
                        const amount = Number(fee.amount) || 0;
                        const paid = Number(fee.amountPaid) || 0;
                        const balance = Math.max(amount - paid, 0);
                        const isPaid = fee.status?.toUpperCase() === "PAID" || balance === 0;

                        return (
                          <article className="fee-card" key={fee.id}>
                            <div className="fee-card-heading">
                              <div className="fee-icon"><Wallet size={22} /></div>
                              <div><h3>{fee.feeType}</h3><p>Fee ID: {fee.id}</p></div>
                              <span className={`fee-status ${isPaid ? "paid" : "pending"}`}>{isPaid ? "PAID" : fee.status || "PENDING"}</span>
                            </div>
                            <div className="fee-amount-grid">
                              <div><span>Total Amount</span><strong>{formatCurrency(amount)}</strong></div>
                              <div><span>Amount Paid</span><strong>{formatCurrency(paid)}</strong></div>
                              <div><span>Balance</span><strong>{formatCurrency(balance)}</strong></div>
                            </div>
                            <div className="fee-due-date">
                              <CalendarDays size={17} />
                              <span>Due Date: {fee.dueDate ? new Date(`${fee.dueDate}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Not specified"}</span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                  <p className="fee-note">This page displays fee records only. Online payments are not enabled yet.</p>
                </section>
              </>
            )}

            {activePage === "Mess Menu" && (
              <>
                <section className="student-welcome">
                  <div><p>YOUR DAILY MEALS</p><h1>Mess Menu</h1><span>Check meals and serving times for each day.</span></div>
                  <Utensils size={55} />
                </section>

                <section className="student-info-card">
                  <div className="profile-heading">
                    <div><h3>Weekly Menu</h3><p>Select a day to view its meals.</p></div>
                    <button onClick={fetchMessMenu} disabled={messLoading}><RefreshCw size={16} /> {messLoading ? "Refreshing..." : "Refresh"}</button>
                  </div>

                  <div className="mess-day-selector">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <button key={day} className={selectedDay === day ? "active" : ""} onClick={() => setSelectedDay(day)}>{day}</button>
                    ))}
                  </div>

                  {messLoading ? <p>Loading the mess menu...</p> : messError ? (
                    <div><p className="profile-error">{messError}</p><button onClick={fetchMessMenu}><RefreshCw size={16} /> Try Again</button></div>
                  ) : todaysMenu.length === 0 ? <p>No menu items are available for {selectedDay}.</p> : (
                    <div className="mess-meal-list">
                      {todaysMenu.map((meal) => (
                        <article className="mess-meal-card" key={meal.id}>
                          <div className="mess-meal-icon"><Utensils size={23} /></div>
                          <div className="mess-meal-details">
                            <span className="mess-meal-type">{meal.mealType}</span>
                            <h3>{meal.menuItems}</h3>
                            <p><Clock size={16} /> {meal.servingTime}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {activePage === "Complaints" && renderComplaints()}
            {activePage === "Leave Requests" && renderLeaveRequests()}
            {activePage === "HostelSnap AI" && renderHostelSnap()}

            {activePage === "My Requests" && (
              <section className="student-info-card">
                <div className="profile-heading">
                  <div><h3>My Requests</h3><p>Quickly access your complaints and leave applications.</p></div>
                  <ClipboardList size={24} />
                </div>
                <div className="student-quick-actions">
                  <button onClick={() => setActivePage("Complaints")}><Wrench size={20} /> View Complaints</button>
                  <button onClick={() => setActivePage("Leave Requests")}><CalendarDays size={20} /> View Leave Requests</button>
                  <button onClick={() => setActivePage("HostelSnap AI")}><Camera size={20} /> Open HostelSnap AI</button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
