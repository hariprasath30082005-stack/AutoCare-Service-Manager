
import { useState, useEffect } from "react";
import axios from "axios";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

import "./App8.css";

const doctors = ["Dr. Vaishnavi", "Dr. Lalitha", "Dr. Aswin"];
const empty = { patient: "", doctor: doctors[0], date: "", time: "" };
const pages = ["Dashboard", "Book Appointment", "Analytics", "Records", "Patients"];

function App8() {
  const [page, setPage] = useState("Dashboard");
  const [patients, setPatients] = useState([]);
  const [apiStatus, setApiStatus] = useState("Loading...");
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [bookings, setBookings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("med8")) || []; }
    catch { return []; }
  });

  const notify = (message, type = "success") => setToast({ message, type });

  const loadAPI = async () => {
    setApiStatus("Loading...");
    try {
      const res = await axios.get("https://dummyjson.com/users?limit=20");
      setPatients(res.data.users);
      setApiStatus("Connected");
    } catch {
      setPatients([]);
      setApiStatus("API unavailable");
      notify("API error", "error");
    }
  };

  useEffect(() => { loadAPI(); }, []);
  useEffect(() => {
    localStorage.setItem("med8", JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const book = e => {
    e.preventDefault();
    if (!form.patient.trim() || !form.date || !form.time)
      return notify("Please fill all fields", "error");

    if (new Date(`${form.date}T${form.time}`) <= new Date())
      return notify("Select future date and time", "error");

    if (bookings.some(b => b.doctor === form.doctor &&
      b.date === form.date && b.time === form.time && b.status !== "Cancelled"))
      return notify("Doctor already booked", "error");

    setBookings([...bookings, { ...form, id: Date.now(), status: "Confirmed" }]);
    setForm(empty);
    setPage("Records");
    notify("Appointment booked successfully");
  };

  const filtered = bookings.filter(b =>
    `${b.patient} ${b.doctor} ${b.date}`.toLowerCase().includes(search.toLowerCase())
  );

  const chart = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    .map((day, i) => ({
      day,
      total: bookings.filter(b =>
        (new Date(b.date + "T00:00:00").getDay() + 6) % 7 === i
      ).length
    }));
     
  const doctorChart = doctors.map(d => ({
    name: d.replace("Dr. ", ""),
    total: bookings.filter(b => b.doctor === d).length
  }));

  const statusChart = ["Confirmed", "Completed", "Cancelled"].map((name, i) => ({
    name,
    value: bookings.filter(b => b.status === name).length,
    fill: ["#0d9488", "#3b82f6", "#ef4444"][i]
  }));

  const radialChart = statusChart.map(s => ({
    ...s,
    percent: bookings.length ? Math.round(s.value / bookings.length * 100) : 0
  }));

  return (
    <div className="m8-app">
      <aside className="m8-sidebar">
        <h2>✚ MediCare</h2>
        <p>HOSPITAL MANAGEMENT</p>
        <nav>
          {pages.map(p => (
            <button key={p} className={page === p ? "active" : ""}
              onClick={() => setPage(p)}>{p}</button>
          ))}
        </nav>
      </aside>

      <main className="m8-main">
        <header className="m8-header">
          <div>
            <small>MEDICARE PRO</small>
            <h1>{page}</h1>
            <p>Hospital Appointment Management</p>
          </div>
          <div className="m8-profile">
            <span>HP</span>
            <div><strong>Admin</strong><small>Hospital Manager</small></div>
          </div>
        </header>

        {page === "Dashboard" && (
          <>
            <div className="m8-stats">
              {[
                ["Appointments", bookings.length],
                ["Patients", patients.length],
                ["Doctors", doctors.length],
                ["Confirmed", bookings.filter(b => b.status === "Confirmed").length]
              ].map(([label, value]) => (
                <div className="m8-stat" key={label}>
                  <p>{label}</p><h2>{value}</h2>
                </div>
              ))}
            </div>
            <div className="m8-grid">
              <div className="m8-card">
                <h2>Quick Actions</h2>
                <p>Manage hospital appointments</p>
                <button className="m8-primary" onClick={() => setPage("Book Appointment")}>
                  + Book Appointment
                </button>
                <button className="m8-secondary" onClick={() => setPage("Records")}>
                  View Records
                </button>
              </div>
              <div className="m8-card">
                <h2>Hospital Overview</h2>
                <p>API Status: {apiStatus}</p>
                <p>Total Appointments: {bookings.length}</p>
                <p>Available Doctors: {doctors.length}</p>
                <button className="m8-secondary" onClick={loadAPI}>Refresh API</button>
              </div>
            </div>
          </>
        )}

        {page === "Book Appointment" && (
          <div className="m8-card m8-form-card">
            <h2>Book New Appointment</h2>
            <p>Enter appointment information below</p>
            <form onSubmit={book} noValidate>
              <label>Patient Name</label>
              <input name="patient" placeholder="Enter patient name"
                value={form.patient} onChange={update} />

              <label>Select Doctor</label>
              <select name="doctor" value={form.doctor} onChange={update}>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>

              <div className="m8-form-row">
                <div>
                  <label>Appointment Date</label>
                  <input type="date" name="date"
                    value={form.date} onChange={update} />
                </div>
                <div>
                  <label>Appointment Time</label>
                  <input type="time" name="time"
                    value={form.time} onChange={update} />
                </div>
              </div>
              <button className="m8-primary">Confirm Appointment</button>
            </form>
          </div>
        )}

        
        {page === "Analytics" && (
          <div className="m8-analytics">
            <div className="m8-card">
              <h2>1. Line Chart - Weekly Appointments</h2>
              <div className="m8-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip />
                    <Line dataKey="total" stroke="#0d9488" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="m8-card">
              <h2>2. Bar Chart - Doctor Appointments</h2>
              <div className="m8-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={doctorChart}>
                    <XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="m8-card">
              <h2>3. Pie Chart - Appointment Status</h2>
              <div className="m8-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={statusChart} dataKey="value" nameKey="name"
                      outerRadius={90} label>
                      {statusChart.map(s => <Cell key={s.name} fill={s.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="m8-card">
              <h2>4. Area Chart - Weekly Activity</h2>
              <div className="m8-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chart}>
                    <XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip />
                    <Area dataKey="total" stroke="#8b5cf6" fill="#ddd6fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="m8-card">
              <h2>5. Radial Bar Chart - Status Percentage</h2>
              <div className="m8-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <RadialBarChart data={radialChart} innerRadius="20%"
                    outerRadius="90%" startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="percent" background />
                    <Tooltip formatter={v => `${v}%`} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {page === "Records" && (
          <div className="m8-card">
            <h2>Appointment Records</h2>
            <p>View and manage appointments</p>
            <input placeholder="Search appointments..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <div className="m8-scroll">
              <table>
                <thead><tr>
                  {["Patient", "Doctor", "Date", "Time", "Status", "Action"]
                    .map(h => <th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td>{b.patient}</td><td>{b.doctor}</td>
                      <td>{b.date}</td><td>{b.time}</td>
                      <td>
                        <select className="m8-status" value={b.status}
                          onChange={e => {
                            setBookings(bookings.map(x => x.id === b.id
                              ? { ...x, status: e.target.value } : x));
                            notify("Status updated");
                          }}>
                          {["Confirmed", "Completed", "Cancelled"]
                            .map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className="m8-delete" onClick={() => {
                          setBookings(bookings.filter(x => x.id !== b.id));
                          notify("Appointment deleted");
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && <p>No appointments found</p>}
            </div>
          </div>
        )}

        {page === "Patients" && (
          <div className="m8-card">
            <h2>Patient List</h2>
            <p>20 DummyJSON API users</p>
            <p>API Status: {apiStatus}</p>
            <button className="m8-secondary" onClick={loadAPI}>Refresh Patients</button>
            <div className="m8-scroll">
              <table>
                <thead><tr>
                  {["ID", "Name", "Age", "Source"]
                    .map(h => <th key={h}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td>PT-{String(p.id).padStart(3, "0")}</td>
                      <td><strong>{p.firstName} {p.lastName}</strong></td>
                      <td>{p.age}</td><td>DummyJSON API</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!patients.length && <p>{apiStatus}</p>}
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className={`m8-toast ${toast.type}`}>
          {toast.type === "error" ? "✕" : "✓"} {toast.message}
        </div>
      )}
    </div>
  );
}

export default App8;
