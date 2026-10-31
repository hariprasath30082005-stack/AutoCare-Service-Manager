
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3004;
const uploadDir = path.join(__dirname, "uploads");
const metadataPath = path.join(__dirname, "files.json");

fs.mkdirSync(uploadDir, { recursive: true });

if (!fs.existsSync(metadataPath)) {
  fs.writeFileSync(metadataPath, "[]");
}

const readFiles = () =>
  JSON.parse(fs.readFileSync(metadataPath, "utf8"));

const writeFiles = files =>
  fs.writeFileSync(metadataPath, JSON.stringify(files, null, 2));

const allowed = [".txt", ".doc", ".docx", ".pdf", ".xlsx"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const id = crypto.randomUUID();
    req.fileId = id;
    cb(null, id + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// Check backend
app.get("/", (req, res) => {
  res.json({ message: "AutoCare backend running" });
});

// Upload and save
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Invalid file" });
  }

  const files = readFiles();
  const ext = path.extname(req.file.originalname).toLowerCase();

  const record = {
    id: req.fileId,
    name: req.file.originalname,
    type: ext === ".xlsx" ? "Excel" : ext.slice(1).toUpperCase(),
    filename: req.file.filename,
    createdAt: new Date().toISOString()
  };

  files.push(record);
  writeFiles(files);

  res.status(201).json(record);
});

// Get all saved files
app.get("/files", (req, res) => {
  res.json(readFiles());
});

// View file in browser
app.get("/files/:id/view", (req, res) => {
  const file = readFiles().find(f => f.id === req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.sendFile(path.join(uploadDir, file.filename));
});

// Download file
app.get("/files/:id/download", (req, res) => {
  const file = readFiles().find(f => f.id === req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.download(path.join(uploadDir, file.filename), file.name);
});

// Delete file
app.delete("/files/:id", (req, res) => {
  const files = readFiles();
  const file = files.find(f => f.id === req.params.id);

  if (!file) return res.status(404).json({ error: "File not found" });

  const filePath = path.join(uploadDir, file.filename);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  writeFiles(files.filter(f => f.id !== req.params.id));
  res.json({ message: "File deleted successfully" });
});

// Handle upload errors
app.use((err, req, res, next) => {
  res.status(err instanceof multer.MulterError ? 400 : 500)
    .json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`AutoCare backend running on http://localhost:${PORT}`);
});