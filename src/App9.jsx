
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import mammoth from "mammoth";
import DOMPurify from "dompurify";

import {
  LayoutDashboard,
  CarFront,
  Wrench,
  ChartNoAxesCombined,
  CalendarDays,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Clock3,
  CircleCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  FileSpreadsheet,
  IndianRupee,
  TrendingUp,
  Activity,
  Sun,
  Moon,
  FolderOpen,
  Eye,
  Download
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

import "./App9.css";

// 1. COMMON DATA

const API = "http://localhost:3002/services";
const FILE_API = "http://localhost:3004";

const types = [
  "Oil Change",
  "Full Service",
  "Brake Service",
  "Car Wash",
  "Engine Check",
  "Tyre Service"
];

const statuses = ["Pending", "In Progress", "Completed"];

const empty = {
  name: "",
  vehicle: "",
  price: "",
  date: "",
  inTime: "",
  outTime: "",
  service: [],
  status: "Pending"
};

const fields = [
  ["name", "NAME", "text"],
  ["vehicle", "VEHICLE", "text"],
  ["price", "PRICE", "number"],
  ["date", "DATE", "date"],
  ["inTime", "IN TIME", "time"]
];

const settingFields = [
  ["center", "Service Center Name", "text"],
  ["admin", "Admin Display Name", "text"],
  ["phone", "Phone Number", "tel"],
  ["email", "Email Address", "email"],
  ["openingTime", "Opening Time", "time"],
  ["closingTime", "Closing Time", "time"]
];

const money = n =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

const services = r =>
  Array.isArray(r.service)
    ? r.service
    : r.service
      ? [r.service]
      : [];

const dateKey = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const dateLabel = d =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

// 2. BACKEND FILE STORAGE

const saveFile = async file => {
  const formData = new FormData();

  formData.append("file", file.blob, file.name);

  const { data } = await axios.post(
    `${FILE_API}/upload`,
    formData
  );

  return data;
};

const getFiles = async () => {
  const { data } = await axios.get(`${FILE_API}/files`);
  return data;
};

const deleteFile = async id => {
  await axios.delete(`${FILE_API}/files/${id}`);
};

const downloadFile = file => {
  const url = `${FILE_API}/files/${file.id}/download`;
  window.open(url, "_blank");
};

// 3. CALENDAR STYLES

const cal = {
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
    gap: 16
  },
  panel: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 13,
    padding: 16,
    minWidth: 0
  },
  title: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: 750,
    margin: 0
  },
  muted: {
    color: "#94a3b8",
    fontSize: 11,
    margin: "4px 0"
  },
  nav: {
    background: "#334155",
    color: "#a5b4fc",
    border: "1px solid #475569",
    borderRadius: 7,
    padding: "8px 11px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7,minmax(0,1fr))",
    gap: 2,
    marginTop: 14
  },
  day: {
    minHeight: 53,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 6,
    color: "#e2e8f0",
    padding: 5,
    textAlign: "left",
    cursor: "pointer",
    overflow: "hidden"
  },
  count: {
    display: "block",
    background: "#4f46e5",
    color: "#fff",
    fontSize: 9,
    padding: "4px 2px",
    borderRadius: 4,
    textAlign: "center",
    marginTop: 6
  },
  metric: {
    background: "#0f172a",
    borderRadius: 9,
    padding: "10px 4px",
    textAlign: "center"
  },
  booking: {
    background: "#253247",
    border: "1px solid #3a4a63",
    borderRadius: 10,
    padding: 12,
    marginTop: 10
  }
};

export default function App9() {
  // 4. REACT STATES

  const [page, setPage] = useState("Dashboard");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [current, setCurrent] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    dateKey(new Date())
  );
  const [calendarSearch, setCalendarSearch] = useState("");

  const [theme, setTheme] = useState(
    () => localStorage.getItem("ac9-theme") || "dark"
  );

  const [settings, setSettings] = useState(() => ({
    center: "Service Center",
    admin: "Admin Management",
    phone: "",
    email: "",
    address: "",
    openingTime: "09:00",
    closingTime: "18:00",
    ...JSON.parse(localStorage.getItem("ac9-settings") || "{}")
  }));

  // FILE STATES

  const [savedFiles, setSavedFiles] = useState([]);
  const [filePanel, setFilePanel] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [previewText, setPreviewText] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [uploading, setUploading] = useState(false);

  const popup = (icon, text) =>
    Swal.fire({
      icon,
      text,
      confirmButtonColor: "#5546e8",
      background: theme === "dark" ? "#1e293b" : "#fff",
      color: theme === "dark" ? "#fff" : "#172033"
    });

  // 5. API - GET

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(API);
      setRecords(data);
      setApiError("");
    } catch {
      setApiError(
        "API is not connected. check with Port 3002 ."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshFiles = async () => {
    const files = await getFiles();

    setSavedFiles(
      files.sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      )
    );
  };

  useEffect(() => {
    load();
    refreshFiles().catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem("ac9-theme", theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 6. ADD / EDIT / DELETE

  const update = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const openDrawer = (record = null, date = "") => {
    setEditingId(record?.id ?? null);

    setForm(
      record
        ? {
            ...empty,
            ...record,
            service: services(record)
          }
        : {
            ...empty,
            date
          }
    );

    setErrors({});
    setDrawer(true);
  };

  const submit = async e => {
    e.preventDefault();

    const err = {};

    if (!form.name.trim()) err.name = "Name required";
    if (!form.vehicle.trim()) err.vehicle = "Vehicle required";

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      err.price = "Valid price required";
    }

    if (!form.date) err.date = "Date required";
    if (!form.inTime) err.inTime = "In Time required";

    if (!form.service.length) {
      err.service = "Select a service";
    }

    if (form.status === "Completed" && !form.outTime) {
      err.outTime = "Out Time required";
    }

    if (
      form.outTime &&
      form.inTime &&
      form.outTime <= form.inTime
    ) {
      err.outTime = "Out Time must be later";
    }

    setErrors(err);

    if (Object.keys(err).length || saving) return;

    const data = {
      ...form,
      name: form.name.trim(),
      vehicle: form.vehicle.trim(),
      price: Number(form.price),
      outTime:
        form.status === "Completed" ? form.outTime : ""
    };

    delete data.id;

    setSaving(true);

    try {
      if (editingId === null) {
        await axios.post(API, data);
      } else {
        await axios.put(`${API}/${editingId}`, data);
      }

      await load();
      setDrawer(false);

      popup(
        "success",
        editingId === null
          ? "Service added!"
          : "Service updated!"
      );
    } catch {
      popup("error", "Unable to save service.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async r => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: r.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/${r.id}`);
      await load();
      popup("success", "Service deleted!");
    } catch {
      popup("error", "Delete failed.");
    }
  };

  const statusChange = async (r, status) => {
    if (status === "Completed" && !r.outTime) {
      openDrawer({ ...r, status });

      return popup(
        "info",
        "Completed panna Out Time enter pannu."
      );
    }

    try {
      await axios.patch(`${API}/${r.id}`, {
        status,
        ...(status !== "Completed" ? { outTime: "" } : {})
      });

      await load();
    } catch {
      popup("error", "Status update failed.");
    }
  };

  // 7. FILTER / PAGINATION / STATS

  const count = status =>
    records.filter(r => r.status === status).length;

  const total = records.length;
  const completed = count("Completed");

  const revenue = records
    .filter(r => r.status === "Completed")
    .reduce((sum, r) => sum + Number(r.price || 0), 0);

  const average = total
    ? records.reduce(
        (sum, r) => sum + Number(r.price || 0),
        0
      ) / total
    : 0;

  const filtered = records.filter(r => {
    const text = [
      r.name,
      r.vehicle,
      r.date,
      ...services(r)
    ]
      .join(" ")
      .toLowerCase();

    return (
      text.includes(search.toLowerCase().trim()) &&
      (filter === "All" || r.status === filter)
    );
  });

  const pagesCount = Math.max(
    1,
    Math.ceil(filtered.length / 10)
  );

  const pageNo = Math.min(current, pagesCount);

  const rows = filtered.slice(
    (pageNo - 1) * 10,
    pageNo * 10
  );

  const stats = [
    ["Total Services", total, CarFront, "blue"],
    ["Pending", count("Pending"), Clock3, "orange"],
    ["In Progress", count("In Progress"), Wrench, "purple"],
    ["Completed", completed, CircleCheck, "green"]
  ];

  // 8. CHART DATA

  const trendMap = {};

  records.forEach(r => {
    if (r.date) {
      trendMap[r.date] =
        (trendMap[r.date] || 0) + Number(r.price || 0);
    }
  });

  const trend = Object.keys(trendMap)
    .sort()
    .map(date => ({
      label: date.slice(5),
      price: trendMap[date]
    }));

  const colors = ["#f59e0b", "#6366f1", "#10b981"];

  const statusData = statuses.map((name, i) => ({
    name,
    value: count(name),
    color: colors[i]
  }));

  const popular = types.map(name => ({
    name,
    count: records.filter(r =>
      services(r).includes(name)
    ).length
  }));

  const recent = [...records]
    .sort((a, b) =>
      String(b.date || "").localeCompare(
        String(a.date || "")
      )
    )
    .slice(0, 5);

  // 9. EXPORT EXCEL / PDF

  const exportFile = async type => {
    const data = filtered.map(r => ({
      Customer: r.name,
      Vehicle: r.vehicle,
      Service: services(r).join(", "),
      Date: r.date,
      "In Time": r.inTime,
      "Out Time": r.outTime,
      "Price (INR)": Number(r.price),
      Status: r.status
    }));

    if (!data.length) {
      return popup("info", "No records to export.");
    }

    try {
      let blob;

      if (type === "Excel") {
        const book = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(data);

        sheet["!cols"] = [
          22, 22, 32, 15, 12, 12, 17, 18
        ].map(wch => ({ wch }));

        XLSX.utils.book_append_sheet(
          book,
          sheet,
          "Services"
        );

        blob = new Blob(
          [
            XLSX.write(book, {
              bookType: "xlsx",
              type: "array"
            })
          ],
          {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }
        );
      } else {
        const doc = new jsPDF({
          orientation: "landscape"
        });

        doc.setFontSize(18);

        doc.text(
          "AutoCare Pro - Service Records",
          14,
          17
        );

        autoTable(doc, {
          startY: 27,
          head: [Object.keys(data[0])],
          body: data.map(r =>
            Object.values(r).map(v => String(v ?? ""))
          ),
          styles: {
            fontSize: 8
          }
        });

        blob = doc.output("blob");
      }

      // SAVE GENERATED FILE TO BACKEND

      await saveFile({
        name: `AutoCare_${Date.now()}.${
          type === "Excel" ? "xlsx" : "pdf"
        }`,
        blob
      });

      await refreshFiles();

      popup(
        "success",
        `${type} exported and stored!`
      );
    } catch (error) {
      console.error(error);
      popup("error", "Export failed.");
    }
  };

  // 10. FILE UPLOAD / VIEW

  const closePreview = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setExcelData([]);
    setPreviewText("");
    setPreviewHtml("");
  };

  const openFilePanel = mode => {
    closePreview();
    setFilePanel(mode);
    refreshFiles().catch(console.error);
  };

  const uploadDocument = async e => {
    const file = e.target.files?.[0];

    if (!file) return;

    e.target.value = "";

    const ext = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      !["txt", "docx", "doc", "pdf", "xlsx"].includes(ext)
    ) {
      return popup(
        "error",
        "Only TXT, DOCX, DOC, PDF and XLSX allowed."
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return popup(
        "error",
        "Maximum file size is 10 MB."
      );
    }

    setUploading(true);

    try {
      await saveFile({
        name: file.name,
        blob: file
      });

      await refreshFiles();

      popup(
        "success",
        "File uploaded successfully!"
      );
    } catch (error) {
      console.error(error);
      popup("error", "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const viewFile = async file => {
    closePreview();

    try {
      // GET FILE CONTENT FROM BACKEND

      const { data: blob } = await axios.get(
        `${FILE_API}/files/${file.id}/view`,
        {
          responseType: "blob"
        }
      );

      if (file.type === "PDF") {
        setPreviewUrl(
          URL.createObjectURL(blob)
        );
      } else if (file.type === "Excel") {
        const book = XLSX.read(
          await blob.arrayBuffer(),
          {
            type: "array"
          }
        );

        setExcelData(
          XLSX.utils.sheet_to_json(
            book.Sheets[book.SheetNames[0]],
            {
              header: 1,
              defval: ""
            }
          )
        );
      } else if (file.type === "TXT") {
        setPreviewText(
          await blob.text()
        );
      } else if (file.type === "DOCX") {
        const result = await mammoth.convertToHtml({
          arrayBuffer: await blob.arrayBuffer()
        });

        setPreviewHtml(
          DOMPurify.sanitize(result.value)
        );
      } else if (file.type === "DOC") {
        // LEGACY DOC PREVIEW USING CONVERTER

        const formData = new FormData();

        formData.append(
          "file",
          blob,
          file.name
        );

        const response = await axios.post(
          "http://localhost:3003/convert-doc",
          formData,
          {
            responseType: "blob",
            timeout: 45000
          }
        );

        setPreviewUrl(
          URL.createObjectURL(response.data)
        );
      } else {
        throw new Error(
          "Unsupported file preview"
        );
      }

      setSelectedFile(file);
    } catch (error) {
      console.error(error);

      popup(
        "error",
        "Unable to preview file."
      );
    }
  };

  const removeFile = async file => {
    const result = await Swal.fire({
      title: "Delete File?",
      text: file.name,
      icon: "warning",
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    try {
      await deleteFile(file.id);

      if (selectedFile?.id === file.id) {
        closePreview();
      }

      await refreshFiles();
    } catch {
      popup(
        "error",
        "Unable to delete file."
      );
    }
  };

  // 11. CALENDAR LOGIC

  const year = month.getFullYear();
  const monthNo = month.getMonth();

  const firstDay = new Date(
    year,
    monthNo,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    monthNo + 1,
    0
  ).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    )
  ];

  while (calendarDays.length % 7) {
    calendarDays.push(null);
  }

  const changeMonth = offset => {
    const next = new Date(
      year,
      monthNo + offset,
      1
    );

    setMonth(next);
    setSelectedDate(dateKey(next));
    setCalendarSearch("");
  };

  const goToday = () => {
    const today = new Date();

    setMonth(today);
    setSelectedDate(dateKey(today));
    setCalendarSearch("");
  };

  const dayBookings = date =>
    records.filter(r => r.date === date);

  const selectedBookings = dayBookings(selectedDate);

  const visibleBookings = selectedBookings.filter(r =>
    [
      r.name,
      r.vehicle,
      ...services(r)
    ]
      .join(" ")
      .toLowerCase()
      .includes(calendarSearch.toLowerCase().trim())
  );

  const dayCount = status =>
    selectedBookings.filter(
      r => r.status === status
    ).length;

  // 12. SETTINGS

  const saveSettings = e => {
    e.preventDefault();

    if (
      !settings.center.trim() ||
      settings.openingTime >= settings.closingTime
    ) {
      return popup(
        "warning",
        "Check center name and working hours."
      );
    }

    localStorage.setItem(
      "ac9-settings",
      JSON.stringify(settings)
    );

    popup(
      "success",
      "Settings saved!"
    );
  };

  const nav = [
    ["Dashboard", LayoutDashboard],
    ["Services", Wrench],
    ["Analytics", ChartNoAxesCombined],
    ["Calendar", CalendarDays],
    ["Settings", Settings]
  ];

  // 13. WEBSITE UI

  return (
    <div
      className={`ac9 ${
        theme === "dark" ? "ac9-dark" : ""
      }`}
    >
      {/* SIDEBAR */}

      <aside className="ac9-sidebar">
        <div className="ac9-logo">
          <CarFront size={27} />

          <div>
            <strong>
              AutoCare <span>Pro</span>
            </strong>

            <small>
              VEHICLE SERVICE MANAGER
            </small>
          </div>
        </div>

        <nav>
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={
                page === name ? "selected" : ""
              }
              onClick={() => setPage(name)}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </nav>

        <div className="ac9-admin">
          <Settings size={18} />

          <div>
            <strong>{settings.center}</strong>
            <small>{settings.admin}</small>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="ac9-main">
        <header className="ac9-top">
          <div>
            <small>
              WORKSPACE / {page.toUpperCase()}
            </small>

            <h1>{page}</h1>
          </div>

          <div className="ac9-top-actions">
            <button
              className="ac9-primary"
              onClick={() => openDrawer()}
            >
              <Plus size={17} />
              Add Service
            </button>
          </div>
        </header>

        <div className="ac9-content">
          {apiError && (
            <div className="ac9-api-error">
              ⚠ {apiError}
            </div>
          )}

          {loading && (
            <p className="ac9-loading">
              Loading service records...
            </p>
          )}

          {/* DASHBOARD */}

          {page === "Dashboard" && (
            <>
              <section className="ac9-hero">
                <div>
                  <small>
                    ✦ SMART SERVICE OPERATIONS
                  </small>

                  <h2>
                    Drive your service center forward.
                  </h2>

                  <p>
                    Manage bookings, track progress and
                    monitor services.
                  </p>

                  <button
                    onClick={() => openDrawer()}
                  >
                    <Plus size={16} />
                    New Booking
                  </button>
                </div>

                <CarFront
                  className="ac9-hero-icon"
                  size={125}
                />
              </section>

              <div className="ac9-stats">
                {stats.map(
                  ([label, value, Icon, tone]) => (
                    <article
                      className="ac9-stat"
                      key={label}
                    >
                      <span
                        className={`ac9-stat-icon ${tone}`}
                      >
                        <Icon size={21} />
                      </span>

                      <p>{label}</p>
                      <h2>{value}</h2>
                    </article>
                  )
                )}
              </div>
            </>
          )}

          {/* SERVICES TABLE */}

          {["Dashboard", "Services"].includes(page) && (
            <section className="ac9-panel ac9-records">
              <div className="ac9-records-head">
                <h3>Service Records</h3>

                <div className="ac9-export-controls">
                  <div className="ac9-export">
                    <button
                      onClick={() => exportFile("Excel")}
                    >
                      <FileSpreadsheet size={16} />
                      Excel
                    </button>

                    <button
                      onClick={() => exportFile("PDF")}
                    >
                      <FileText size={16} />
                      PDF
                    </button>
                  </div>

                  <div className="ac9-small-actions">
                    <button
                      onClick={() =>
                        openFilePanel("view")
                      }
                    >
                      <Eye size={13} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        openFilePanel("download")
                      }
                    >
                      <Download size={13} />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="ac9-filters">
                <div className="ac9-search">
                  <Search size={17} />

                  <input
                    placeholder="Search customer, vehicle or service..."
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setCurrent(1);
                    }}
                  />
                </div>

                <select
                  value={filter}
                  onChange={e => {
                    setFilter(e.target.value);
                    setCurrent(1);
                  }}
                >
                  <option>All</option>

                  {statuses.map(s => (
                    <option key={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ac9-table-scroll">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Customer",
                        "Vehicle",
                        "Service",
                        "Date",
                        "Price",
                        "Status",
                        "Actions"
                      ].map(h => (
                        <th key={h}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(r => (
                      <tr key={r.id}>
                        <td>
                          <b>{r.name}</b>
                        </td>

                        <td>{r.vehicle}</td>

                        <td>
                          {services(r).join(", ")}
                        </td>

                        <td>{r.date}</td>

                        <td>{money(r.price)}</td>

                        <td>
                          <select
                            className={`ac9-status ${(
                              r.status || "Pending"
                            )
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            value={
                              r.status || "Pending"
                            }
                            onChange={e =>
                              statusChange(
                                r,
                                e.target.value
                              )
                            }
                          >
                            {statuses.map(s => (
                              <option key={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <div className="ac9-row-actions">
                            <button
                              onClick={() =>
                                openDrawer(r)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => remove(r)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!rows.length && (
                  <div className="ac9-empty">
                    No service records found
                  </div>
                )}
              </div>

              <div className="ac9-pagination">
                <span>
                  Showing {rows.length} of{" "}
                  {filtered.length} records
                </span>

                <div>
                  <button
                    disabled={pageNo === 1}
                    onClick={() =>
                      setCurrent(pageNo - 1)
                    }
                  >
                    Previous
                  </button>

                  <b>
                    {pageNo} / {pagesCount}
                  </b>

                  <button
                    disabled={pageNo >= pagesCount}
                    onClick={() =>
                      setCurrent(pageNo + 1)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ANALYTICS */}

          {page === "Analytics" && (
            <>
              <section className="ac9-analytics-banner">
                <div>
                  <h2>
                    Service Performance Overview
                  </h2>

                  <p>
                    Track revenue, bookings and service
                    activity.
                  </p>
                </div>

                <TrendingUp size={27} />
              </section>

              <div className="ac9-stats ac9-analytics-stats">
                {[
                  ["Total Bookings", total, CarFront],
                  [
                    "Completed Jobs",
                    completed,
                    CircleCheck
                  ],
                  [
                    "Completed Revenue",
                    money(revenue),
                    IndianRupee
                  ],
                  [
                    "Average Price",
                    money(Math.round(average)),
                    TrendingUp
                  ]
                ].map(([label, value, Icon]) => (
                  <article
                    className="ac9-stat"
                    key={label}
                  >
                    <span className="ac9-stat-icon blue">
                      <Icon size={21} />
                    </span>

                    <p>{label}</p>
                    <h2>{value}</h2>
                  </article>
                ))}
              </div>

              <div className="ac9-analytics-panels">
                <section className="ac9-panel ac9-chart-card">
                  <h3>
                    Service Price Trend
                  </h3>

                  <p>
                    Prices by scheduled service date
                  </p>

                  <div className="ac9-chart-box">
                    {trend.length ? (
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <AreaChart data={trend}>
                          <CartesianGrid
                            vertical={false}
                            stroke={
                              theme === "dark"
                                ? "#334155"
                                : "#eee"
                            }
                          />

                          <XAxis dataKey="label" />
                          <YAxis />

                          <Tooltip formatter={money} />

                          <Area
                            dataKey="price"
                            stroke="#6366f1"
                            fill="#6366f155"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ac9-no-chart">
                        No data
                      </div>
                    )}
                  </div>
                </section>

                <section className="ac9-panel ac9-chart-card">
                  <h3>
                    Service Status
                  </h3>

                  <p>
                    Booking distribution
                  </p>

                  <div className="ac9-chart-box ac9-donut-box">
                    {total ? (
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="53%"
                            outerRadius="76%"
                          >
                            {statusData.map(s => (
                              <Cell
                                key={s.name}
                                fill={s.color}
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ac9-no-chart">
                        No data
                      </div>
                    )}
                  </div>

                  <div className="ac9-status-legend">
                    {statusData.map(s => (
                      <span key={s.name}>
                        <i
                          style={{
                            background: s.color
                          }}
                        />

                        {s.name}: {s.value}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="ac9-panel ac9-chart-card">
                  <h3>
                    Popular Services
                  </h3>

                  <p>
                    Most requested service types
                  </p>

                  <div className="ac9-chart-box">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart data={popular}>
                        <CartesianGrid
                          vertical={false}
                          stroke={
                            theme === "dark"
                              ? "#334155"
                              : "#eee"
                          }
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={65}
                        />

                        <YAxis allowDecimals={false} />
                        <Tooltip />

                        <Bar
                          dataKey="count"
                          fill="#6366f1"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="ac9-panel ac9-chart-card">
                  <h3>
                    Recent Activity
                  </h3>

                  <p>
                    Latest scheduled bookings
                  </p>

                  <div className="ac9-activity-list">
                    {recent.length ? (
                      recent.map(r => (
                        <div
                          className="ac9-activity-item"
                          key={r.id}
                        >
                          <span className="ac9-activity-icon">
                            <Activity size={19} />
                          </span>

                          <div>
                            <strong>
                              {r.name}
                            </strong>

                            <small>
                              {r.vehicle} ·{" "}
                              {services(r).join(", ")}
                            </small>
                          </div>

                          <b>
                            {money(r.price)}
                          </b>
                        </div>
                      ))
                    ) : (
                      <div className="ac9-no-chart">
                        No activity
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* CALENDAR */}

          {page === "Calendar" && (
            <section
              className="ac9-panel ac9-calendar"
              style={{ padding: 18 }}
            >
              <div
                className="ac9-calendar-heading"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  gap: 12
                }}
              >
                <div>
                  <h2>
                    Service Calendar
                  </h2>

                  <p>
                    Select a date to view client bookings.
                  </p>
                </div>

                <button
                  className="ac9-primary"
                  onClick={() =>
                    openDrawer(null, selectedDate)
                  }
                >
                  <Plus size={16} />
                  Add Booking
                </button>
              </div>

              <div
                className="ac9-calendar-two-col"
                style={cal.layout}
              >
                {/* LEFT CALENDAR */}

                <div style={cal.panel}>
                  <h3 style={cal.title}>
                    {month.toLocaleDateString(
                      "en-IN",
                      {
                        month: "long",
                        year: "numeric"
                      }
                    )}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      style={cal.nav}
                      title="Previous year"
                      onClick={() => changeMonth(-12)}
                    >
                      <ChevronsLeft size={15} />
                    </button>

                    <button
                      style={cal.nav}
                      title="Previous month"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <button
                      style={cal.nav}
                      onClick={goToday}
                    >
                      Today
                    </button>

                    <button
                      style={cal.nav}
                      title="Next month"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight size={15} />
                    </button>

                    <button
                      style={cal.nav}
                      title="Next year"
                      onClick={() => changeMonth(12)}
                    >
                      <ChevronsRight size={15} />
                    </button>
                  </div>

                  <div style={cal.grid}>
                    {[
                      "SUN",
                      "MON",
                      "TUE",
                      "WED",
                      "THU",
                      "FRI",
                      "SAT"
                    ].map(day => (
                      <div
                        key={day}
                        style={{
                          color: "#93b4e8",
                          fontSize: 10,
                          textAlign: "center",
                          fontWeight: 700,
                          padding: "8px 0"
                        }}
                      >
                        {day}
                      </div>
                    ))}

                    {calendarDays.map((day, i) => {
                      if (!day) {
                        return (
                          <div
                            key={`blank-${i}`}
                          />
                        );
                      }

                      const date = dateKey(
                        new Date(
                          year,
                          monthNo,
                          day
                        )
                      );

                      const bookings = dayBookings(date);

                      const selected =
                        selectedDate === date;

                      const today =
                        date === dateKey(new Date());

                      return (
                        <button
                          key={date}
                          style={{
                            ...cal.day,
                            background: selected
                              ? "#5546e8"
                              : "#1e293b",
                            borderColor: selected
                              ? "#7161ff"
                              : today
                                ? "#6366f1"
                                : "#334155"
                          }}
                          onClick={() => {
                            setSelectedDate(date);
                            setCalendarSearch("");
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              color: "#f8fafc"
                            }}
                          >
                            {day}
                          </strong>

                          {bookings.length > 0 && (
                            <span
                              style={{
                                ...cal.count,
                                background: selected
                                  ? "#a5b4fc"
                                  : "#4338ca",
                                color: selected
                                  ? "#1e1b4b"
                                  : "#fff"
                              }}
                            >
                              {bookings.length} Booking
                              {bookings.length !== 1
                                ? "s"
                                : ""}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 13,
                      marginTop: 18,
                      fontSize: 11,
                      color: "#cbd5e1"
                    }}
                  >
                    <span>🟠 Pending</span>
                    <span>🟣 In Progress</span>
                    <span>🟢 Completed</span>
                  </div>
                </div>

                {/* RIGHT BOOKINGS */}

                <div style={cal.panel}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <div>
                      <small
                        style={{
                          color: "#64748b",
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      >
                        SELECTED DATE
                      </small>

                      <h3 style={cal.title}>
                        {dateLabel(selectedDate)}
                      </h3>

                      <p style={cal.muted}>
                        {selectedBookings.length} Bookings
                      </p>
                    </div>

                    <button
                      className="ac9-primary"
                      onClick={() =>
                        openDrawer(null, selectedDate)
                      }
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(4,minmax(0,1fr))",
                      gap: 6,
                      marginTop: 13
                    }}
                  >
                    {[
                      [
                        "Total",
                        selectedBookings.length
                      ],
                      [
                        "Pending",
                        dayCount("Pending")
                      ],
                      [
                        "Completed",
                        dayCount("Completed")
                      ],
                      [
                        "In Progress",
                        dayCount("In Progress")
                      ]
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={cal.metric}
                      >
                        <strong
                          style={{
                            color: "#635bff",
                            fontSize: 18,
                            display: "block"
                          }}
                        >
                          {value}
                        </strong>

                        <small
                          style={{
                            color: "#64748b",
                            fontSize: 9
                          }}
                        >
                          {label}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid #475569",
                      background: "#253247",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 13
                    }}
                  >
                    <Search
                      size={16}
                      color="#94a3b8"
                    />

                    <input
                      value={calendarSearch}
                      onChange={e =>
                        setCalendarSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search client or vehicle..."
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#f8fafc",
                        width: "100%",
                        fontSize: 12
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      maxHeight: 420,
                      overflowY: "auto",
                      paddingRight: 4
                    }}
                  >
                    {visibleBookings.map(r => (
                      <div
                        key={r.id}
                        style={cal.booking}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            gap: 8,
                            alignItems: "center"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center"
                            }}
                          >
                            <span
                              style={{
                                background: "#e0e7ff",
                                color: "#4f46e5",
                                borderRadius: 8,
                                width: 31,
                                height: 31,
                                display: "grid",
                                placeItems: "center",
                                fontWeight: 700
                              }}
                            >
                              {r.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>

                            <div>
                              <strong
                                style={{
                                  color: "#fff",
                                  fontSize: 12
                                }}
                              >
                                {r.name}
                              </strong>

                              <small
                                style={{
                                  ...cal.muted,
                                  display: "block"
                                }}
                              >
                                {r.vehicle}
                              </small>
                            </div>
                          </div>

                          <span
                            style={{
                              background:
                                r.status === "Completed"
                                  ? "#14532d"
                                  : r.status ===
                                      "In Progress"
                                    ? "#3730a3"
                                    : "#78350f",
                              color:
                                r.status === "Completed"
                                  ? "#86efac"
                                  : r.status ===
                                      "In Progress"
                                    ? "#c4b5fd"
                                    : "#fde68a",
                              fontSize: 10,
                              padding: "5px 7px",
                              borderRadius: 5
                            }}
                          >
                            {r.status}
                          </span>
                        </div>

                        <p
                          style={{
                            ...cal.muted,
                            marginTop: 12,
                            lineHeight: 1.7
                          }}
                        >
                          <Wrench
                            size={12}
                            style={{
                              display: "inline",
                              verticalAlign: "middle"
                            }}
                          />

                          {" "}
                          {services(r).join(", ")}
                          {" · "}

                          <Clock3
                            size={12}
                            style={{
                              display: "inline",
                              verticalAlign: "middle"
                            }}
                          />

                          {" "}
                          {r.inTime}
                        </p>

                        <p style={cal.muted}>
                          {money(r.price)}
                        </p>

                        <div
                          style={{
                            borderTop:
                              "1px solid #475569",
                            marginTop: 10,
                            paddingTop: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            gap: 8
                          }}
                        >
                          <small style={cal.muted}>
                            Out Time:{" "}
                            {r.outTime ||
                              "Not completed"}
                          </small>

                          <button
                            onClick={() =>
                              openDrawer(r)
                            }
                            style={{
                              background: "#ede9fe",
                              color: "#4f46e5",
                              border: "none",
                              borderRadius: 6,
                              padding: "7px 10px",
                              display: "flex",
                              gap: 5,
                              alignItems: "center",
                              cursor: "pointer",
                              fontSize: 11
                            }}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}

                    {!visibleBookings.length && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: 35,
                          color: "#94a3b8"
                        }}
                      >
                        <CalendarDays size={28} />

                        <p>
                          No bookings found for this date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SETTINGS */}

          {page === "Settings" && (
            <section className="ac9-panel ac9-settings">
              <div className="ac9-heading">
                <h2>
                  Service Center Settings
                </h2>

                <p>
                  Manage appearance, business information
                  and working hours.
                </p>
              </div>

              <div className="ac9-theme-setting">
                <div className="ac9-theme-info">
                  {theme === "light" ? (
                    <Sun size={24} />
                  ) : (
                    <Moon size={24} />
                  )}

                  <div>
                    <h3>
                      Appearance
                    </h3>

                    <p>
                      Choose your preferred theme
                    </p>
                  </div>
                </div>

                <div className="ac9-theme-buttons">
                  {["light", "dark"].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={
                        theme === t ? "active" : ""
                      }
                      onClick={() => setTheme(t)}
                    >
                      {t === "light" ? (
                        <Sun size={17} />
                      ) : (
                        <Moon size={17} />
                      )}

                      {t === "light"
                        ? "Light"
                        : "Dark"}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={saveSettings}>
                <div className="ac9-settings-grid">
                  {settingFields.map(
                    ([key, label, type]) => (
                      <label key={key}>
                        {label}

                        <input
                          type={type}
                          value={settings[key]}
                          onChange={e =>
                            setSettings(s => ({
                              ...s,
                              [key]: e.target.value
                            }))
                          }
                        />
                      </label>
                    )
                  )}

                  <label className="ac9-full">
                    Business Address

                    <textarea
                      rows={4}
                      value={settings.address}
                      onChange={e =>
                        setSettings(s => ({
                          ...s,
                          address: e.target.value
                        }))
                      }
                    />
                  </label>
                </div>

                <button
                  className="ac9-primary"
                  type="submit"
                >
                  Save Settings
                </button>
              </form>

              <p className="ac9-settings-note">
                Settings and theme are saved in this browser.
              </p>
            </section>
          )}
        </div>
      </main>

      {/* ADD / EDIT DRAWER */}

      {drawer && (
        <div
          className="ac9-overlay"
          onMouseDown={() =>
            !saving && setDrawer(false)
          }
        >
          <aside
            className="ac9-drawer"
            onMouseDown={e =>
              e.stopPropagation()
            }
          >
            <div className="ac9-drawer-head">
              <div>
                <small>
                  VEHICLE SERVICE MANAGEMENT
                </small>

                <h2>
                  {editingId === null
                    ? "Add New Service"
                    : "Edit Service"}
                </h2>
              </div>

              <button
                onClick={() => setDrawer(false)}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={submit}
              noValidate
            >
              <div className="ac9-drawer-body">
                <p>
                  Enter the vehicle and customer service
                  details below.
                </p>

                <div className="ac9-form-grid">
                  {fields.map(
                    ([key, label, type]) => (
                      <label key={key}>
                        {label}

                        <input
                          type={type}
                          value={form[key]}
                          min={
                            type === "number"
                              ? "0"
                              : undefined
                          }
                          className={
                            errors[key]
                              ? "invalid"
                              : ""
                          }
                          onChange={e =>
                            update(
                              key,
                              e.target.value
                            )
                          }
                        />

                        {errors[key] && (
                          <small className="ac9-field-error">
                            ⚠ {errors[key]}
                          </small>
                        )}
                      </label>
                    )
                  )}

                  <label>
                    STATUS

                    <select
                      value={form.status}
                      onChange={e =>
                        update(
                          "status",
                          e.target.value
                        )
                      }
                    >
                      {statuses.map(s => (
                        <option key={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  {form.status === "Completed" && (
                    <label>
                      OUT TIME

                      <input
                        type="time"
                        value={form.outTime}
                        className={
                          errors.outTime
                            ? "invalid"
                            : ""
                        }
                        onChange={e =>
                          update(
                            "outTime",
                            e.target.value
                          )
                        }
                      />

                      {errors.outTime && (
                        <small className="ac9-field-error">
                          ⚠ {errors.outTime}
                        </small>
                      )}
                    </label>
                  )}

                  <div className="ac9-service-options">
                    <strong>
                      SERVICE TYPE
                    </strong>

                    <div className="ac9-check-grid">
                      {types.map(t => (
                        <label key={t}>
                          <input
                            type="checkbox"
                            checked={form.service.includes(
                              t
                            )}
                            onChange={e =>
                              update(
                                "service",
                                e.target.checked
                                  ? [
                                      ...form.service,
                                      t
                                    ]
                                  : form.service.filter(
                                      s => s !== t
                                    )
                              )
                            }
                          />

                          {t}
                        </label>
                      ))}
                    </div>

                    {errors.service && (
                      <small className="ac9-field-error">
                        ⚠ {errors.service}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <footer className="ac9-drawer-footer">
                <button
                  type="button"
                  className="ac9-secondary"
                  onClick={() =>
                    setDrawer(false)
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ac9-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId === null
                      ? "Save Service"
                      : "Update Service"}
                </button>
              </footer>
            </form>
          </aside>
        </div>
      )}

      {/* FILE POPUP */}

      {filePanel && (
        <div className="ac9-files-overlay">
          <div
            className="ac9-files-modal"
            style={{
              width: selectedFile
                ? "min(900px,95vw)"
                : "min(500px,94vw)",
              minHeight: "auto",
              maxHeight: selectedFile
                ? "90vh"
                : "65vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div
              className="ac9-files-header"
              style={{
                padding: "12px 16px"
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 16
                  }}
                >
                  {filePanel === "view"
                    ? "View Exported Files"
                    : "Download Exported Files"}
                </h2>

                <p>
                  {savedFiles.length} saved files
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <label
                  className="ac9-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 11px",
                    cursor: uploading
                      ? "wait"
                      : "pointer",
                    fontSize: 11
                  }}
                >
                  <Plus size={14} />

                  {uploading
                    ? "Uploading..."
                    : "Upload"}

                  <input
                    type="file"
                    hidden
                    disabled={uploading}
                    accept=".txt,.docx,.doc,.pdf,.xlsx"
                    onChange={uploadDocument}
                  />
                </label>

                <button
                  onClick={() => {
                    closePreview();
                    setFilePanel("");
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!selectedFile ? (
              <div
                className="ac9-files-list"
                style={{
                  padding: 12,
                  overflowY: "auto",
                  minHeight: 0
                }}
              >
                {savedFiles.map(file => (
                  <div
                    className="ac9-file-item"
                    key={file.id}
                    style={{
                      padding: 10,
                      gap: 10,
                      marginBottom: 8
                    }}
                  >
                    <div
                      className={`ac9-file-icon ${
                        file.type === "PDF"
                          ? "pdf"
                          : "excel"
                      }`}
                      style={{
                        width: 36,
                        height: 36,
                        flexShrink: 0
                      }}
                    >
                      {file.type === "Excel" ? (
                        <FileSpreadsheet
                          size={19}
                        />
                      ) : (
                        <FileText size={19} />
                      )}
                    </div>

                    <div
                      className="ac9-file-info"
                      style={{
                        minWidth: 0
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 12,
                          overflowWrap: "anywhere"
                        }}
                      >
                        {file.name}
                      </strong>

                      <small
                        style={{
                          fontSize: 10
                        }}
                      >
                        {file.type}

                        {file.count != null
                          ? ` • ${file.count} records`
                          : " • Uploaded document"}
                      </small>

                      <small
                        style={{
                          fontSize: 10
                        }}
                      >
                        {new Date(
                          file.createdAt
                        ).toLocaleString("en-IN")}
                      </small>
                    </div>

                    <div className="ac9-file-buttons">
                      <button
                        style={{
                          padding: "7px 9px",
                          fontSize: 11
                        }}
                        onClick={() =>
                          filePanel === "view"
                            ? viewFile(file)
                            : downloadFile(file)
                        }
                      >
                        {filePanel === "view" ? (
                          <>
                            <Eye size={14} />
                            View
                          </>
                        ) : (
                          <>
                            <Download size={14} />
                            Download
                          </>
                        )}
                      </button>

                      <button
                        className="ac9-file-delete"
                        style={{
                          padding: "7px 9px"
                        }}
                        onClick={() =>
                          removeFile(file)
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {!savedFiles.length && (
                  <div className="ac9-files-empty">
                    <FolderOpen size={30} />

                    <h3>
                      No saved files found
                    </h3>

                    <p>
                      Export Excel/PDF or upload TXT,
                      DOCX, DOC, PDF or XLSX.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="ac9-preview-toolbar">
                  <button
                    onClick={closePreview}
                  >
                    <ChevronLeft size={17} />
                    Back to Files
                  </button>

                  <span>
                    {selectedFile.name}
                  </span>

                  <button
                    onClick={() =>
                      downloadFile(selectedFile)
                    }
                  >
                    <Download size={15} />
                    Download
                  </button>
                </div>

                {["PDF", "DOC"].includes(
                  selectedFile.type
                ) ? (
                  <iframe
                    title="Document Preview"
                    src={previewUrl}
                    className="ac9-pdf-preview"
                  />
                ) : selectedFile.type === "Excel" ? (
                  <div className="ac9-excel-preview">
                    <table>
                      <thead>
                        <tr>
                          {(excelData[0] || []).map(
                            (cell, i) => (
                              <th key={i}>
                                {cell}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {excelData
                          .slice(1)
                          .map((row, i) => (
                            <tr key={i}>
                              {(excelData[0] || []).map(
                                (_, j) => (
                                  <td key={j}>
                                    {row[j] ?? ""}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : selectedFile.type === "TXT" ? (
                  <pre
                    style={{
                      background: "#fff",
                      color: "#1e293b",
                      padding: 20,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      overflow: "auto",
                      flex: 1,
                      minHeight: 250,
                      fontFamily:
                        "Consolas, monospace",
                      fontSize: 13,
                      lineHeight: 1.7
                    }}
                  >
                    {previewText}
                  </pre>
                ) : selectedFile.type === "DOCX" ? (
                  <div
                    style={{
                      background: "#fff",
                      color: "#1e293b",
                      padding: 20,
                      overflow: "auto",
                      overflowWrap: "anywhere",
                      flex: 1,
                      minHeight: 250,
                      lineHeight: 1.7,
                      fontSize: 14
                    }}
                    dangerouslySetInnerHTML={{
                      __html: previewHtml
                    }}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
