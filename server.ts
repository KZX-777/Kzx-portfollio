import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS views (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    count INTEGER DEFAULT 0
  );
  INSERT OR IGNORE INTO portfolio (id, data) VALUES (1, '{}');
  INSERT OR IGNORE INTO views (id, count) VALUES (1, 0);
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/portfolio", (req, res) => {
    const row = db.prepare("SELECT data FROM portfolio WHERE id = 1").get() as { data: string };
    const views = db.prepare("SELECT count FROM views WHERE id = 1").get() as { count: number };
    res.json({ ...JSON.parse(row.data), views: views.count });
  });

  app.post("/api/portfolio", (req, res) => {
    const { password, data } = req.body;
    // Simple admin check
    if (password !== "Ultraadmin275673@772") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    db.prepare("UPDATE portfolio SET data = ? WHERE id = 1").run(JSON.stringify(data));
    res.json({ success: true });
  });

  app.post("/api/views", (req, res) => {
    db.prepare("UPDATE views SET count = count + 1 WHERE id = 1").run();
    const views = db.prepare("SELECT count FROM views WHERE id = 1").get() as { count: number };
    res.json({ views: views.count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
