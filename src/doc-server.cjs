
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const run = promisify(execFile);
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ]
}));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

app.post(
  "/convert-doc",
  upload.single("file"),
  async (req, res) => {

    if (
      !req.file ||
      path.extname(req.file.originalname).toLowerCase() !== ".doc"
    ) {
      return res.status(400).json({
        error: "DOC file required"
      });
    }

    const folder = await fs.mkdtemp(
      path.join(os.tmpdir(), "ac-doc-")
    );

    try {
      const input = path.join(folder, "input.doc");
      const output = path.join(folder, "input.pdf");

      await fs.writeFile(input, req.file.buffer);

      await run(
        process.env.LIBREOFFICE_PATH || "soffice",
        [
          "-env:UserInstallation=file:///" +
            path.join(folder, "lo-profile").replace(/\\/g, "/"),
          "--headless",
          "--convert-to",
          "pdf",
          "--outdir",
          folder,
          input
        ],
        {
          timeout: 30000
        }
      );

      const pdf = await fs.readFile(output);

      res.type("application/pdf").send(pdf);

    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: "DOC conversion failed"
      });

    } finally {
      await fs.rm(folder, {
        recursive: true,
        force: true
      });
    }
  }
);

app.listen(3003, () => {
  console.log(
    "DOC converter running on port 3003"
  );
});