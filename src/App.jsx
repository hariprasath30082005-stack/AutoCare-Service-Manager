import { useMemo, useState } from "react";
import "./App.css";

const initialWorkouts = [
  { id: 1, name: "Full Body Strength", type: "Strength", duration: 45, calories: 320, level: "Intermediate", done: true },
  { id: 2, name: "Morning Cardio", type: "Cardio", duration: 30, calories: 240, level: "Beginner", done: false },
  { id: 3, name: "Core & Mobility", type: "Mobility", duration: 25, calories: 150, level: "Beginner", done: false },
  { id: 4, name: "Upper Body Power", type: "Strength", duration: 50, calories: 360, level: "Advanced", done: false },
];

const initialMembers = [
  { id: 101, name: "Arun Kumar", email: "arun@example.com", plan: "Premium", status: "Active" },
  { id: 102, name: "Priya S", email: "priya@example.com", plan: "Standard", status: "Active" },
  { id: 103, name: "Rahul M", email: "rahul@example.com", plan: "Premium", status: "Paused" },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [showWorkout, setShowWorkout] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [toast, setToast] = useState("");

  const completed = workouts.filter((w) => w.done).length;
  const totalCalories = workouts.filter((w) => w.done).reduce((sum, w) => sum + w.calories, 0);
  const progress = Math.round((completed / workouts.length) * 100);

  const filteredMembers = useMemo(
    () =>
      members.filter((m) =>
        `${m.name} ${m.email} ${m.plan}`.toLowerCase().includes(search.toLowerCase())
      ),
    [members, search]
  );

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function toggleWorkout(id) {
    setWorkouts((current) =>
      current.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    );
    notify("Workout status updated");
  }

  function addWorkout(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const workout = {
      id: Date.now(),
      name: form.get("name"),
      type: form.get("type"),
      duration: Number(form.get("duration")),
      calories: Number(form.get("calories")),
      level: form.get("level"),
      done: false,
    };
    setWorkouts((current) => [workout, ...current]);
    setShowWorkout(false);
    notify("Workout added successfully");
    event.currentTarget.reset();
  }

  function addMember(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const member = {
      id: Date.now(),
      name: form.get("name"),
      email: form.get("email"),
      plan: form.get("plan"),
      status: "Active",
    };
    setMembers((current) => [member, ...current]);
    setShowMember(false);
    notify("Member added successfully");
    event.currentTarget.reset();
  }

  const nav = ["Dashboard", "Workouts", "Members", "Progress"];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div><strong>FitFlow</strong><span>Fitness Studio</span></div>
        </div>

        <nav>
          {nav.map((item) => (
            <button
              key={item}
              className={active === item ? "nav-item active" : "nav-item"}
              onClick={() => setActive(item)}
            >
              <span className="nav-icon">
                {item === "Dashboard" ? "⌂" : item === "Workouts" ? "◈" : item === "Members" ? "♙" : "↗"}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="mini-icon">✦</div>
          <strong>Stay consistent</strong>
          <p>Small steps every day create lasting progress.</p>
        </div>

        <div className="profile">
          <div className="avatar">HL</div>
          <div><strong>Hariprasath</strong><span>Administrator</span></div>
          <button aria-label="Profile menu">•••</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">FITNESS MANAGEMENT</p>
            <h1>{active}</h1>
          </div>
          <div className="top-actions">
            <div className="search">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
              />
            </div>
            <button className="icon-button" aria-label="Notifications">♧</button>
            <div className="top-avatar">HL</div>
          </div>
        </header>

        {active === "Dashboard" && (
          <>
            <section className="hero">
              <div>
                <span className="badge">GOOD MORNING</span>
                <h2>Ready for a stronger day?</h2>
                <p>Track workouts, members and progress from one simple dashboard.</p>
                <button className="primary" onClick={() => setShowWorkout(true)}>+ Add Workout</button>
              </div>
              <div className="hero-art">
                <div className="ring"><span>{progress}%</span><small>weekly goal</small></div>
              </div>
            </section>

            <section className="stats-grid">
              <Stat icon="◷" label="Workouts" value={completed} note="completed this week" />
              <Stat icon="⚡" label="Calories" value={totalCalories.toLocaleString()} note="burned this week" />
              <Stat icon="♙" label="Members" value={members.length} note="registered members" />
              <Stat icon="↗" label="Goal progress" value={`${progress}%`} note="weekly completion" />
            </section>

            <div className="content-grid">
              <section className="panel">
                <div className="panel-head">
                  <div><h3>Today's workouts</h3><p>Keep your routine moving</p></div>
                  <button className="link-button" onClick={() => setActive("Workouts")}>View all →</button>
                </div>
                <div className="workout-list">
                  {workouts.slice(0, 4).map((w) => (
                    <WorkoutRow key={w.id} workout={w} onToggle={() => toggleWorkout(w.id)} />
                  ))}
                </div>
              </section>

              <section className="panel progress-panel">
                <div className="panel-head">
                  <div><h3>Weekly progress</h3><p>Your activity overview</p></div>
                </div>
                <div className="progress-chart">
                  {[55, 72, 48, 86, 62, 92, 68].map((height, i) => (
                    <div className="bar-wrap" key={i}>
                      <div className="bar" style={{ height: `${height}%` }} />
                      <span>{["M","T","W","T","F","S","S"][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-footer"><strong>6.8 hrs</strong><span>+14% vs last week</span></div>
              </section>
            </div>
          </>
        )}

        {active === "Workouts" && (
          <section className="panel page-panel">
            <div className="page-head">
              <div><h2>Workout library</h2><p>Create and manage training sessions.</p></div>
              <button className="primary" onClick={() => setShowWorkout(true)}>+ Add Workout</button>
            </div>
            <div className="workout-grid">
              {workouts.map((w) => (
                <article className="workout-card" key={w.id}>
                  <div className="workout-cover"><span>{w.type}</span><b>{w.done ? "✓" : "○"}</b></div>
                  <div className="workout-body">
                    <span className="muted">{w.level}</span>
                    <h3>{w.name}</h3>
                    <div className="workout-meta"><span>◷ {w.duration} min</span><span>⚡ {w.calories} kcal</span></div>
                    <button className={w.done ? "secondary done" : "secondary"} onClick={() => toggleWorkout(w.id)}>
                      {w.done ? "Completed" : "Mark complete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === "Members" && (
          <section className="panel page-panel">
            <div className="page-head">
              <div><h2>Members</h2><p>Manage your fitness community.</p></div>
              <button className="primary" onClick={() => setShowMember(true)}>+ Add Member</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id}>
                      <td><div className="member-cell"><div className="avatar small">{m.name.split(" ").map(x => x[0]).join("")}</div><div><strong>{m.name}</strong><span>{m.email}</span></div></div></td>
                      <td>{m.plan}</td>
                      <td><span className={m.status === "Active" ? "status active-status" : "status paused-status"}>{m.status}</span></td>
                      <td><button className="more">•••</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && <div className="empty">No members found.</div>}
            </div>
          </section>
        )}

        {active === "Progress" && (
          <section className="progress-page">
            <div className="content-grid">
              <section className="panel big-progress">
                <div className="panel-head"><div><h3>Weekly activity</h3><p>Monitor consistency across the week.</p></div></div>
                <div className="large-bars">
                  {[45, 65, 52, 78, 60, 90, 70].map((h, i) => <div key={i} className="large-bar-col"><div className="large-bar" style={{height: `${h}%`}}></div><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}
                </div>
              </section>
              <section className="panel goal-card">
                <span className="badge">WEEKLY GOAL</span>
                <div className="goal-number">{progress}%</div>
                <p>Great work. Complete more sessions to reach your weekly target.</p>
                <div className="progress-line"><span style={{width: `${progress}%`}} /></div>
              </section>
            </div>
          </section>
        )}
      </main>

      {showWorkout && (
        <Modal title="Add workout" onClose={() => setShowWorkout(false)}>
          <form onSubmit={addWorkout} className="form-grid">
            <label>Workout name<input required name="name" placeholder="e.g. Evening Strength" /></label>
            <label>Type<select name="type"><option>Strength</option><option>Cardio</option><option>Mobility</option><option>Yoga</option></select></label>
            <label>Duration (minutes)<input required min="1" type="number" name="duration" placeholder="45" /></label>
            <label>Calories<input required min="0" type="number" name="calories" placeholder="300" /></label>
            <label>Level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
            <div className="form-actions"><button type="button" className="secondary" onClick={() => setShowWorkout(false)}>Cancel</button><button className="primary">Save workout</button></div>
          </form>
        </Modal>
      )}

      {showMember && (
        <Modal title="Add member" onClose={() => setShowMember(false)}>
          <form onSubmit={addMember} className="form-grid">
            <label>Full name<input required name="name" placeholder="Member name" /></label>
            <label>Email<input required type="email" name="email" placeholder="member@email.com" /></label>
            <label>Plan<select name="plan"><option>Standard</option><option>Premium</option></select></label>
            <div className="form-actions"><button type="button" className="secondary" onClick={() => setShowMember(false)}>Cancel</button><button className="primary">Add member</button></div>
          </form>
        </Modal>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function Stat({ icon, label, value, note }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function WorkoutRow({ workout, onToggle }) {
  return (
    <div className="workout-row">
      <div className="workout-symbol">{workout.type[0]}</div>
      <div className="workout-info"><strong>{workout.name}</strong><span>{workout.duration} min · {workout.calories} kcal</span></div>
      <button className={workout.done ? "check completed" : "check"} onClick={onToggle}>{workout.done ? "✓" : "○"}</button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return <div className="overlay" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</div></div>;
}

export default App;
