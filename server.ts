import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Setup ---
const db = new Database("portfolio.db");

// Initialize Local DB (Fallback)
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

// --- Supabase Setup (Cloud Persistence) ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const isValidSupabaseConfig = (url: string | undefined, key: string | undefined): url is string => {
  if (!url || !key) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const supabase = isValidSupabaseConfig(supabaseUrl, supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
  console.log("☁️ Supabase cloud storage initialized.");
} else {
  console.log("📂 Using local SQLite storage (No Supabase keys found).");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      if (supabase) {
        const { data: portfolio } = await supabase.from('portfolio').select('data').eq('id', 1).single();
        const { data: views } = await supabase.from('views').select('count').eq('id', 1).single();
        
        // If Supabase is empty, fallback to local or empty
        const finalData = portfolio ? JSON.parse(portfolio.data) : {};
        const finalViews = views ? views.count : 0;
        
        return res.json({ ...finalData, views: finalViews });
      }
    } catch (err) {
      console.error("Supabase fetch error, falling back to SQLite", err);
    }

    // SQLite Fallback
    const row = db.prepare("SELECT data FROM portfolio WHERE id = 1").get() as { data: string };
    const views = db.prepare("SELECT count FROM views WHERE id = 1").get() as { count: number };
    res.json({ ...JSON.parse(row.data), views: views.count });
  });

  app.post("/api/portfolio", async (req, res) => {
    const { password, data } = req.body;
    if (password !== "Ultraadmin275673@772") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      if (supabase) {
        // Upsert data in Supabase
        await supabase.from('portfolio').upsert({ id: 1, data: JSON.stringify(data) });
        return res.json({ success: true });
      }
    } catch (err) {
      console.error("Supabase save error, falling back to SQLite", err);
    }

    // SQLite Fallback
    db.prepare("UPDATE portfolio SET data = ? WHERE id = 1").run(JSON.stringify(data));
    res.json({ success: true });
  });

  app.post("/api/views", async (req, res) => {
    try {
      if (supabase) {
        const { data: current } = await supabase.from('views').select('count').eq('id', 1).single();
        const newCount = (current?.count || 0) + 1;
        await supabase.from('views').upsert({ id: 1, count: newCount });
        return res.json({ views: newCount });
      }
    } catch (err) {
      console.error("Supabase views error, falling back to SQLite", err);
    }

    // SQLite Fallback
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
