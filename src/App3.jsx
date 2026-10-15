import { useState } from "react";
import "./App3.css";

function App3() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: "Full Body Strength",
      type: "Strength",
      duration: 45,
      calories: 320,
      completed: true,
    },
    {
      id: 2,
      name: "Morning Cardio",
      type: "Cardio",
      duration: 30,
      calories: 240,
      completed: false,
    },
    {
      id: 3,
      name: "Core & Mobility",
      type: "Mobility",
      duration: 25,
      calories: 150,
      completed: false,
    },
    {
      id: 4,
      name: "Upper Body Power",
      type: "chest",
      duration: 40,
      calories: 290,
      completed: false,
    },
    {
      id: 5,
      name: "Morning Yoga",
      type: "Yoga",
      duration: 40,
      calories: 180,
      completed: false,
    },
    {
      id: 6,
      name: "HIIT Power",
      type: "HIIT",
      duration: 25,
      calories: 300,
      completed: false,
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Vaishnavi H",
      email: "navi@gmail.com",
      plan: "Premium",
      status: "Active",
    },
    {
      id: 2,
      name: "Jahir K",
      email: "jahir@gmail.com",
      plan: "Basic",
      status: "Active",
    },
    {
      id: 3,
      name: "Anand S",
      email: "anand@gmail.com",
      plan: "Premium",
      status: "Inactive",
    },
  ]);

  const [showWorkout, setShowWorkout] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState("");

  const [newWorkout, setNewWorkout] = useState({
    name: "",
    type: "Strength",
    duration: "",
    calories: "",
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    plan: "Basic",
  });

  const getWorkoutImage = (type) => {
    const images = {
      Strength:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkpFviTbkqHMekWn9L7HV5GD907pYh-aZPXHRueIFBOA&s=10",

      Cardio:
        "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85",

      Mobility:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",

      Yoga:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",

      HIIT:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85",

      Core:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwXw7LbwyehtD4GmtLA46maO6vuSE3INaY2b7sdHKqQ&s=10",
    };

    return (
      images[type] ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLwXw7LbwyehtD4GmtLA46maO6vuSE3INaY2b7sdHKqQ&s=10"
    );
  };

  const completed = workouts.filter(
    (workout) => workout.completed
  ).length;

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const toggleWorkout = (id) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === id
          ? {
              ...workout,
              completed: !workout.completed,
            }
          : workout
      )
    );
  };

  const addWorkout = (e) => {
    e.preventDefault();

    if (
      !newWorkout.name ||
      !newWorkout.duration ||
      !newWorkout.calories
    ) {
      showToast("Please fill all workout fields");
      return;
    }

    const workout = {
      id: Date.now(),
      name: newWorkout.name,
      type: newWorkout.type,
      duration: Number(newWorkout.duration),
      calories: Number(newWorkout.calories),
      completed: false,
    };

    setWorkouts([...workouts, workout]);

    setNewWorkout({
      name: "",
      type: "Strength",
      duration: "",
      calories: "",
    });

    setShowWorkout(false);

    showToast(`${workout.name} added successfully`);
  };

  const addMember = (e) => {
    e.preventDefault();

    if (!newMember.name || !newMember.email) {
      showToast("Please fill all member fields");
      return;
    }

    const member = {
      id: Date.now(),
      name: newMember.name,
      email: newMember.email,
      plan: newMember.plan,
      status: "Active",
    };

    setMembers([...members, member]);

    setNewMember({
      name: "",
      email: "",
      plan: "Basic",
    });

    setShowMember(false);

    showToast(`${member.name} added successfully`);
  };

  return (
    <div className="fitness-app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">F</div>
          <span>FitFlow</span>
        </div>

        <div className="menu-title">MENU</div>

        <button
          className={
            activePage === "Dashboard"
              ? "menu active"
              : "menu"
          }
          onClick={() => setActivePage("Dashboard")}
        >
          <span className="menu-icon">⌂</span>
          Dashboard
          <span className="menu-arrow">→</span>
        </button>

        <button
          className={
            activePage === "Workouts"
              ? "menu active"
              : "menu"
          }
          onClick={() => setActivePage("Workouts")}
        >
          <span className="menu-icon">◉</span>
          Workouts
          <span className="menu-arrow">→</span>
        </button>

        <button
          className={
            activePage === "Members"
              ? "menu active"
              : "menu"
          }
          onClick={() => setActivePage("Members")}
        >
          <span className="menu-icon">♙</span>
          Members
          <span className="menu-arrow">→</span>
        </button>

        <button
          className={
            activePage === "Progress"
              ? "menu active"
              : "menu"
          }
          onClick={() => setActivePage("Progress")}
        >
          <span className="menu-icon">▥</span>
          Progress
          <span className="menu-arrow">→</span>
        </button>

        <div className="sidebar-bottom">

          <button
            className="coach-card"
            onClick={() => {
              setShowProfile(true);
              showToast("Hari's profile opened");
            }}
          >
            <div className="coach-avatar">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJB5tRROWbbnpkd_EGDFvOE-cyOppx-wj5QEJQ9B8bBg&s=10"
                alt="Hari"
              />
            </div>

            <div className="coach-info">
              <strong>Hari</strong>
              <small>Fitness Coach</small>
            </div>
          </button>

        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <h1>{activePage}</h1>

            <p>
              Manage your fitness activities and members.
            </p>
          </div>

          <div className="top-actions">

            <button className="notification">
              ♢
            </button>

            <div className="profile">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJB5tRROWbbnpkd_EGDFvOE-cyOppx-wj5QEJQ9B8bBg&s=10"
                alt="Hari"
              />
            </div>

          </div>

        </header>

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <>

            {/* =====================================
                WELCOME CARD
            ===================================== */}

            <section className="welcome-card">

              {/* LEFT SIDE */}

              <div className="welcome-left">

                <img
                  className="welcome-emoji-bg"
                  src="https://images.unsplash.com/photo-1749555968665-b84ffaa5ac5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbGlzdGljJTIwZ3ltJTIwZW1vaml8ZW58MHx8MHx8fDA%3D"
                  alt="Fitness"
                />

                <div className="welcome-text">

                  <span className="small-label">
                    GOOD MORNING
                  </span>

                  <h2>
                    Welcome back, Hari 👋
                  </h2>

                  <p>
                    Keep going! You are making great
                    progress this week.
                  </p>

                  <button className="start-btn">
                    Start Workout →
                  </button>

                </div>

              </div>

              {/* RIGHT SIDE */}

              <div className="welcome-image">

                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvshb2OVoVMH_w7rm593cMaZkao0bwyeMWC6vjm7038Q&s=10"
                  alt="Fitness"
                />

              </div>

            </section>

            {/* STATS */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon green">

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzhbKZvaxvrs8pU5H6EYPlVUYAtifTHicECtEnO6wzOg&s=10"
                    alt="Calories Burned"
                  />

                </div>

                <div>
                  <span>Completed Workouts</span>
                  <strong>{completed}</strong>
                  <small>This week</small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7D1XqnNvTLzS180jln8GYJeg1CPCnwx9Ngn6BO5eiXA&s=10"
                    alt="Calories Burned"
                  />

                </div>

                <div>
                  <span>Calories Burned</span>
                  <strong>2,450</strong>
                  <small>+12% from last week</small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon blue">

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJa7bp2IRHczy1Rg_l3nglEHG8GzSb3b0sSNR2SbwRMw&s=10"
                    alt="Total Members"
                  />

                </div>

                <div>
                  <span>Total Members</span>
                  <strong>{members.length}</strong>
                  <small>Active members</small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon purple">

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzLDAomwTHqjmF1zfePEEIbkOXEYtzx-UD0HE9nnEL9Q&s=10"
                    alt="Weekly Goal"
                  />

                </div>

                <div>
                  <span>Weekly Goal</span>
                  <strong>72%</strong>
                  <small>Great progress!</small>
                </div>

              </div>

            </section>

            {/* DASHBOARD CONTENT */}

            <section className="content-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>Today's Workouts</h3>

                    <p>
                      Your scheduled workouts for today
                    </p>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      setShowWorkout(true)
                    }
                  >
                    + Add Workout
                  </button>

                </div>

                <div className="workout-list">

                  {workouts.map((workout) => (

                    <div
                      className="workout-item"
                      key={workout.id}
                    >

                      <div className="workout-left">

                        <div className="workout-symbol">

                          <img
                            src={getWorkoutImage(
                              workout.type
                            )}
                            alt={workout.type}
                          />

                        </div>

                        <div>

                          <h4>
                            {workout.name}
                          </h4>

                          <p>
                            {workout.type} •{" "}
                            {workout.duration} min •{" "}
                            {workout.calories} kcal
                          </p>

                        </div>

                      </div>

                      <button
                        className={
                          workout.completed
                            ? "complete-btn completed"
                            : "complete-btn"
                        }
                        onClick={() =>
                          toggleWorkout(workout.id)
                        }
                      >
                        {workout.completed
                          ? "Completed"
                          : "Complete"}
                      </button>

                    </div>

                  ))}

                </div>

              </div>

              {/* WEEKLY GOAL */}

              <div className="panel goal-panel">

                <div className="panel-header">

                  <div>
                    <h3>Weekly Goal</h3>
                    <p>Workout consistency</p>
                  </div>

                </div>

                <div className="circle-progress">

                  <div>
                    <strong>72%</strong>
                    <span>Complete</span>
                  </div>

                </div>

                <div className="goal-info">
                  <span>5 of 7 workouts</span>
                  <span>2 remaining</span>
                </div>

              </div>

            </section>

          </>
        )}

        {/* WORKOUTS */}

        {activePage === "Workouts" && (

          <section className="page-section">

            <div className="page-heading">

              <div>
                <h2>Workouts</h2>

                <p>
                  Choose a workout and start your
                  fitness journey.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowWorkout(true)
                }
              >
                + Add Workout
              </button>

            </div>

            <div className="workout-grid">

              {workouts.map((workout) => (

                <div
                  className="workout-card"
                  key={workout.id}
                >

                  <div className="workout-image">

                    <img
                      src={getWorkoutImage(
                        workout.type
                      )}
                      alt={workout.name}
                    />

                    <div className="image-type">
                      {workout.type}
                    </div>

                  </div>

                  <div className="workout-card-content">

                    <h3>
                      {workout.name}
                    </h3>

                    <p>
                      Improve your performance,
                      build consistency and stay
                      active with this workout.
                    </p>

                    <div className="workout-meta">

                      <span>
                        ⏱ {workout.duration} min
                      </span>

                      <span>
                        🔥 {workout.calories} kcal
                      </span>

                    </div>

                    <button
                      className={
                        workout.completed
                          ? "complete-btn completed full"
                          : "complete-btn full"
                      }
                      onClick={() =>
                        toggleWorkout(workout.id)
                      }
                    >
                      {workout.completed
                        ? "Completed ✓"
                        : "Mark Complete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* MEMBERS */}

        {activePage === "Members" && (

          <section className="page-section">

            <div className="page-heading">

              <div>
                <h2>Members</h2>

                <p>
                  Manage your fitness center members.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowMember(true)
                }
              >
                + Add Member
              </button>

            </div>

            <div className="table-card">

              <table>

                <thead>

                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {members.map((member) => (

                    <tr key={member.id}>

                      <td>

                        <div className="member-name">

                          <div className="member-avatar">
                            {member.name.charAt(0)}
                          </div>

                          {member.name}

                        </div>

                      </td>

                      <td>
                        {member.email}
                      </td>

                      <td>
                        <span className="plan">
                          {member.plan}
                        </span>
                      </td>

                      <td>
                        <span className="status">
                          {member.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

        )}

        {/* PROGRESS */}

        {activePage === "Progress" && (

          <section className="page-section">

            <div className="page-heading">

              <div>
                <h2>Your Progress</h2>

                <p>
                  Track your weekly fitness performance.
                </p>
              </div>

            </div>

            <div className="progress-layout">

              <div className="panel">

                <h3>Weekly Activity</h3>

                <div className="chart">

                  <div
                    className="bar"
                    style={{ height: "45%" }}
                  >
                    <span>Mon</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "70%" }}
                  >
                    <span>Tue</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "55%" }}
                  >
                    <span>Wed</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "85%" }}
                  >
                    <span>Thu</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "65%" }}
                  >
                    <span>Fri</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "95%" }}
                  >
                    <span>Sat</span>
                  </div>

                  <div
                    className="bar"
                    style={{ height: "35%" }}
                  >
                    <span>Sun</span>
                  </div>

                </div>

              </div>

              <div className="panel progress-summary">

                <h3>This Week</h3>

                <div className="progress-number">
                  72%
                </div>

                <p>
                  You are doing great. Keep your
                  consistency and complete your
                  remaining workouts.
                </p>

                <div className="progress-line">
                  <div></div>
                </div>

              </div>

            </div>

          </section>

        )}

      </main>

      {/* ADD WORKOUT MODAL */}

      {showWorkout && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Add Workout</h2>
                <p>Create a new workout.</p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowWorkout(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={addWorkout}>

              <label>Workout Name</label>

              <input
                type="text"
                placeholder="Example: Chest Workout"
                value={newWorkout.name}
                onChange={(e) =>
                  setNewWorkout({
                    ...newWorkout,
                    name: e.target.value,
                  })
                }
              />

              <label>Workout Type</label>

              <select
                value={newWorkout.type}
                onChange={(e) =>
                  setNewWorkout({
                    ...newWorkout,
                    type: e.target.value,
                  })
                }
              >
                <option>Strength</option>
                <option>Cardio</option>
                <option>Mobility</option>
                <option>Yoga</option>
                <option>HIIT</option>
                <option>Core</option>
              </select>

              <p className="image-note">
                🖼 Image will be automatically selected
                based on workout type.
              </p>

              <label>Duration</label>

              <input
                type="number"
                placeholder="Minutes"
                value={newWorkout.duration}
                onChange={(e) =>
                  setNewWorkout({
                    ...newWorkout,
                    duration: e.target.value,
                  })
                }
              />

              <label>Calories</label>

              <input
                type="number"
                placeholder="Calories"
                value={newWorkout.calories}
                onChange={(e) =>
                  setNewWorkout({
                    ...newWorkout,
                    calories: e.target.value,
                  })
                }
              />

              <button className="primary-btn modal-btn">
                Add Workout
              </button>

            </form>

          </div>

        </div>

      )}

      {/* ADD MEMBER MODAL */}

      {showMember && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Add Member</h2>
                <p>Add a new gym member.</p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowMember(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={addMember}>

              <label>Name</label>

              <input
                type="text"
                placeholder="Enter member name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    name: e.target.value,
                  })
                }
              />

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    email: e.target.value,
                  })
                }
              />

              <label>Plan</label>

              <select
                value={newMember.plan}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    plan: e.target.value,
                  })
                }
              >
                <option>Basic</option>
                <option>Premium</option>
              </select>

              <button className="primary-btn modal-btn">
                Add Member
              </button>

            </form>

          </div>

        </div>

      )}

      {/* PROFILE MODAL */}

      {showProfile && (

        <div
          className="modal-overlay"
          onClick={() => setShowProfile(false)}
        >

          <div
            className="profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="profile-close"
              onClick={() =>
                setShowProfile(false)
              }
            >
              ×
            </button>

            <div className="profile-large-avatar">

              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJB5tRROWbbnpkd_EGDFvOE-cyOppx-wj5QEJQ9B8bBg&s=10"
                alt="Hari"
              />

            </div>

            <h2>Hari</h2>

            <p className="profile-role">
              Fitness Coach
            </p>

            <div className="profile-details">

              <div className="profile-detail">
                <span>Role</span>
                <strong>Fitness Coach</strong>
              </div>

              <div className="profile-detail">
                <span>Status</span>
                <strong className="profile-active">
                  Active
                </strong>
              </div>

              <div className="profile-detail">
                <span>Department</span>
                <strong>
                  Fitness & Training
                </strong>
              </div>

              <div className="profile-detail">
                <span>Experience</span>
                <strong>3 Years</strong>
              </div>

            </div>

            <button
              className="profile-edit-btn"
              onClick={() =>
                setShowProfile(false)
              }
            >
              Close Profile
            </button>

          </div>

        </div>

      )}

      {/* TOAST */}

      {toast && (

        <div className="toast">

          <div className="toast-icon">
            ✓
          </div>

          <div>
            <strong>FitFlow</strong>
            <span>{toast}</span>
          </div>

          <button
            onClick={() => setToast("")}
          >
            ×
          </button>

        </div>

      )}

    </div>
  );
}

export default App3;