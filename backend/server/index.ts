import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import apiRoutes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize DB
  initDb();

  // CORS — allow Vercel frontend and localhost dev
  app.use((req, res, next) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    const origin = req.headers.origin || '';
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
    next();
  });

  app.use(express.json());

  // Ensure uploads directory exists and serve it
  const uploadsDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.use("/api", apiRoutes);


  // Production static files — only if frontend dist exists (local only; on Render, frontend is on Vercel)
  if (process.env.NODE_ENV === "production" || process.env.SERVE_STATIC === "true") {
    const distPath = path.resolve(__dirname, "../../frontend/dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Basera Server running on http://localhost:${PORT}`);
  });
}

startServer();
