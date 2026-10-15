import {useState,useEffect,useMemo,useCallback,useRef,} from "react";
import "./App5.css";

const malePhoto ="https://images.unsplash.com/photo-1772371272152-d1806d4351e0?w=300&auto=format&fit=crop&q=80";

const femalePhoto ="https://plus.unsplash.com/premium_photo-1739786995552-0a2ccfa62ba5?w=300&auto=format&fit=crop&q=80";

const initialStudents = [
  { id: 1, name: "Hariprasath L", course: "React JS", gender: "Male" },
  { id: 2, name: "Vaishnavi S", course: "Python", gender: "Female" },
  { id: 3, name: "Akshu K", course: "Java", gender: "Female" },
  { id: 4, name: "Divya R", course: "Web Design", gender: "Female" },
  { id: 5, name: "Karthik", course: "React JS", gender: "Male" },
  { id: 6, name: "Nisha", course: "Python", gender: "Female" },
];

const navItems = [
  { name: "Profile", icon: "♙" },
  { name: "Schedule", icon: "▦" },
  { name: "Students", icon: "♧" },
  { name: "Settings", icon: "⚙" },
];

function StudentCard({ student, onView, onDelete }) {
  return (
    <article className="s5-student-card">
      <div
        className={`s5-photo ${
          student.gender === "Female" ? "s5-girl" : "s5-boy"
        }`}
      >
        <img
          src={student.gender === "Female" ? femalePhoto : malePhoto}
          alt={`${student.gender} student`}
        />
      </div>

      <div className="s5-student-details">
        <h3>{student.name}</h3>
        <p>{student.course}</p>
        <span className="s5-level">{student.gender}</span>
      </div>

      <div className="s5-card-actions">
        <button className="s5-view-btn" onClick={() => onView(student)}>
          View
        </button>
        <button
          className="s5-delete-btn"
          aria-label={`Delete ${student.name}`}
          onClick={() => onDelete(student.id)}
        >
          ×
        </button>
      </div>
    </article>
  );
}

export default function App5() {
  const [students, setStudents] = useState(initialStudents);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("male");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("Students");
  const [toast, setToast] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [loggedOut, setLoggedOut] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [displayName, setDisplayName] = useState("Hariprasath L");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const nameRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (!toast) return;

    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);

    return () => clearTimeout(toastTimerRef.current);
  }, [toast]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    return students.filter((student) =>
      `${student.name} ${student.course} ${student.gender}`
        .toLowerCase()
        .includes(term)
    );
  }, [students, search]);

  const addStudent = useCallback(
    (event) => {
      event.preventDefault();

      if (!name.trim() || !course.trim()) {
        showToast("Please enter student name and course.", "error");
        nameRef.current?.focus();
        return;
      }

      const newStudent = {
        id: Date.now(),
        name: name.trim(),
        course: course.trim(),
        gender,
      };

      setStudents((previous) => [...previous, newStudent]);
      setName("");
      setCourse("");
      setGender("Male");

      showToast(`${newStudent.name} added successfully!`);
      nameRef.current?.focus();
    },
    [name, course, gender, showToast]
  );

  const deleteStudent = useCallback(
    (id) => {
      const student = students.find((item) => item.id === id);
      setStudents((previous) => previous.filter((item) => item.id !== id));
      showToast(`${student?.name ?? "Student"} deleted successfully!`);
    },
    [students, showToast]
  );

  const viewStudent = useCallback((student) => {
    setSelectedStudent(student);
  }, []);

  function changePage(page) {
    setActivePage(page);
    setSelectedStudent(null);
  }

  if (loggedOut) {
    return (
      <div className="s5-logout-screen">
        <div className="s5-logout-card">
          <div className="s5-logout-logo">H</div>
          <h1>You have logged out</h1>
          <p>Your StudentHub session has ended.</p>
          <button
            className="s5-add-btn"
            onClick={() => {
              setLoggedOut(false);
              setActivePage("Students");
              showToast("Welcome back to StudentHub!");
            }}
          >
            Return to StudentHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`s5-app ${darkMode ? "s5-dark" : ""}`}>
      <aside className="s5-sidebar">
        <div className="s5-logo">H</div>
        <div className="s5-brand-label">STUDENTHUB</div>

        <nav className="s5-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`s5-nav-item ${
                activePage === item.name ? "s5-selected" : ""
              }`}
              onClick={() => changePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <button
          className="s5-logout"
          onClick={() => setShowLogout(true)}
        >
          <span>↗</span> Log out
        </button>
      </aside>

      <main className="s5-main">
        <header className="s5-topbar">
          <div>
            <p className="s5-eyebrow">STUDENT MANAGEMENT PLATFORM</p>
            <h1 className="s5-page-title">
              {activePage === "Students" ? "Students" : activePage}
            </h1>
          </div>
          <div className="s5-user-chip">
            <div className="s5-user-avatar">H</div>
            <div>
              <strong>{displayName}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {activePage === "Students" && (
          <section className="s5-dashboard">
            <div className="s5-welcome">
              <div>
                <span className="s5-kicker">YOUR CLASSROOM</span>
                <h2>Manage your students</h2>
                <p>Keep your student records organized in one place.</p>
              </div>
              <div className="s5-welcome-icon">✦</div>
            </div>

            <div className="s5-stats">
              <article className="s5-stat-card">
                <div className="s5-stat-icon purple">♧</div>
                <div>
                  <span>Total students</span>
                  <strong>{students.length}</strong>
                  <small>Registered records</small>
                </div>
              </article>
              <article className="s5-stat-card">
                <div className="s5-stat-icon pink">♀</div>
                <div>
                  <span>Female students</span>
                  <strong>
                    {students.filter((s) => s.gender === "Female").length}
                  </strong>
                  <small>Current records</small>
                </div>
              </article>
              <article className="s5-stat-card">
                <div className="s5-stat-icon blue">♂</div>
                <div>
                  <span>Male students</span>
                  <strong>
                    {students.filter((s) => s.gender === "Male").length}
                  </strong>
                  <small>Current records</small>
                </div>
              </article>
            </div>

            <div className="s5-panel">
              <div className="s5-toolbar">
                <div>
                  <h2>Student directory</h2>
                  <p>Add, search and manage student records.</p>
                </div>
                <div className="s5-search">
                  <span>⌕</span>
                  <input
                    type="search"
                    placeholder="Search name, course..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search students"
                  />
                  {search && (
                    <button
                      className="s5-clear-search"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <form className="s5-form" onSubmit={addStudent}>
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Student name"
                  aria-label="Student name"
                />
                <input
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="Course name"
                  aria-label="Course name"
                />
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  aria-label="Student gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <button type="submit" className="s5-add-btn">
                  + Add Student
                </button>
              </form>

              <div className="s5-list-info">
                <span>
                  Showing {filteredStudents.length} of {students.length} students
                </span>
                <span>Student records</span>
              </div>

              <div className="s5-grid">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onView={viewStudent}
                    onDelete={deleteStudent}
                  />
                ))}

                {filteredStudents.length === 0 && (
                  <div className="s5-empty">
                    <div>⌕</div>
                    <h3>No students found</h3>
                    <p>Try another search or add a new student.</p>
                    <button
                      className="s5-view-btn"
                      onClick={() => setSearch("")}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activePage === "Profile" && (
          <section className="s5-dashboard">
            <div className="s5-section-heading">
              <h2>My profile</h2>
              <p>View and update your account information.</p>
            </div>
            <div className="s5-profile-card">
              <div className="s5-profile-banner" />
              <div className="s5-profile-body">
                <div className="s5-profile-avatar">H</div>
                <span className="s5-level">Administrator</span>
                <label htmlFor="s5-display-name">Display name</label>
                <input
                  id="s5-display-name"
                  className="s5-settings-input"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
                <label>Email address</label>
                <p className="s5-profile-value">hariprasath300805@gmail.com</p>
                <label>Department</label>
                <p className="s5-profile-value">Student Management</p>
                <button
                  className="s5-add-btn"
                  onClick={() => showToast("Profile updated successfully!")}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </section>
        )}

        {activePage === "Schedule" && (
          <section className="s5-dashboard">
            <div className="s5-section-heading">
              <h2>Class schedule</h2>
              <p>Sample learning timetable for your students.</p>
            </div>
            <div className="s5-schedule-list">
              {[
                ["09:00 AM", "React JS", "Components and props", "Mon"],
                ["11:00 AM", "Python", "Functions and data handling", "Tue"],
                ["01:30 PM", "Java", "Object-oriented programming", "Wed"],
                ["03:00 PM", "Web Design", "HTML and CSS practice", "Thu"],
                 ["02:00 PM", "Database", "SQL", "Fri"],
                 ["10:00 PM", "Test Session", "paste week covered sylabus", "Sat"],
              ].map(([time, title, detail, day]) => (
                <article className="s5-schedule-item" key={time}>
                  <div className="s5-schedule-day">{day}</div>
                  <div className="s5-schedule-time">{time}</div>
                  <div className="s5-schedule-detail">
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </div>
                  <span className="s5-level">Scheduled</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === "Settings" && (
          <section className="s5-dashboard">
            <div className="s5-section-heading">
              <h2>Preferences</h2>
              <p>Personalize your StudentHub experience.</p>
            </div>
            <div className="s5-settings-card">
              <div>
                <h3>Notifications</h3>
                <p>Show confirmation and activity messages.</p>
              </div>
              <label className="s5-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
                <span />
              </label>
            </div>
            <div className="s5-settings-card">
              <div>
                <h3>Dark appearance</h3>
                <p>Switch the dashboard to a darker theme.</p>
              </div>
              <label className="s5-switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(event) => setDarkMode(event.target.checked)}
                />
                <span />
              </label>
            </div>
            <div className="s5-settings-card">
              <div>
                <h3>Student records</h3>
                <p>{students.length} records currently in this session.</p>
              </div>
              <span className="s5-level">Active</span>
            </div>
            <button
              className="s5-add-btn s5-settings-save"
              onClick={() => showToast("Preferences updated successfully!")}
            >
              Save Preferences
            </button>
          </section>
        )}

        <footer className="s5-footer">
          <span>StudentHub</span> · Student Management Platform
        </footer>
      </main>

      {selectedStudent && (
        <div
          className="s5-modal-backdrop"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="s5-confirm-modal s5-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="s5-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="s5-modal-close"
              onClick={() => setSelectedStudent(null)}
              aria-label="Close student details"
            >
              ×
            </button>
            <img
              className="s5-detail-photo"
              src={
                selectedStudent.gender === "Female" ? femalePhoto : malePhoto
              }
              alt=""
            />
            <h2 id="s5-detail-title">{selectedStudent.name}</h2>
            <p>Student details</p>
            <div className="s5-detail-row">
              <span>Course</span>
              <strong>{selectedStudent.course}</strong>
            </div>
            <div className="s5-detail-row">
              <span>Gender</span>
              <strong>{selectedStudent.gender}</strong>
            </div>
            <button
              className="s5-add-btn"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLogout && (
        <div
          className="s5-modal-backdrop"
          onClick={() => setShowLogout(false)}
        >
          <div
            className="s5-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="s5-logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="s5-modal-icon">↗</div>
            <h2 id="s5-logout-title">Log out?</h2>
            <p>Are you sure you want to leave StudentHub?</p>
            <div className="s5-modal-actions">
              <button
                className="s5-cancel-btn"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
              <button
                className="s5-add-btn"
                onClick={() => {
                  setShowLogout(false);
                  setLoggedOut(true);
                }}
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && notifications && (
        <div
          key={toast.id}
          className={`s5-toast s5-toast-${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <span className="s5-toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </span>
          <div className="s5-toast-content">
            <strong>{toast.type === "success" ? "Success" : "Error"}</strong>
            <p>{toast.message}</p>
          </div>
          <button
            className="s5-toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}