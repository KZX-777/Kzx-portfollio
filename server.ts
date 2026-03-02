import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Setup ---
let db: any = null;

const getDb = async () => {
  if (process.env.NODE_ENV === "production") return null; // Never use SQLite on Vercel
  
  if (!db) {
    try {
      const Database = (await import("better-sqlite3")).default;
      db = new Database("portfolio.db");
      db.exec(`
        CREATE TABLE IF NOT EXISTS portfolio (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT);
        CREATE TABLE IF NOT EXISTS views (id INTEGER PRIMARY KEY CHECK (id = 1), count INTEGER DEFAULT 0);
        INSERT OR IGNORE INTO portfolio (id, data) VALUES (1, '{}');
        INSERT OR IGNORE INTO views (id, count) VALUES (1, 0);
      `);
    } catch (e) {
      return null;
    }
  }
  return db;
};

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

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- API Routes (Registered immediately for Vercel) ---

// Debug Route
app.get("/api/debug", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    hasUrl: !!process.env.SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_KEY,
    supabaseActive: !!supabase
  });
});

app.get("/api/portfolio", async (req, res) => {
  try {
    if (supabase) {
      const { data: portfolio } = await supabase.from('portfolio').select('data').eq('id', 1).single();
      const { data: views } = await supabase.from('views').select('count').eq('id', 1).single();
      
      const finalData = portfolio ? JSON.parse(portfolio.data) : {};
      const finalViews = views ? views.count : 0;
      
      return res.json({ ...finalData, views: finalViews });
    }
  } catch (err) {
    console.error("Supabase fetch error:", err);
  }

  if (process.env.NODE_ENV === "production") {
    return res.json({ views: 0 });
  }

  const database = await getDb();
  if (database) {
    try {
      const row = database.prepare("SELECT data FROM portfolio WHERE id = 1").get() as { data: string };
      const views = database.prepare("SELECT count FROM views WHERE id = 1").get() as { count: number };
      return res.json({ ...JSON.parse(row.data), views: views.count });
    } catch (e) {
      return res.json({ views: 0 });
    }
  }
  res.json({ views: 0 });
});

app.post("/api/portfolio", async (req, res) => {
  const { password, data } = req.body;
  if (password !== "Ultraadmin275673@772") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (supabase) {
      const { error } = await supabase.from('portfolio').upsert({ id: 1, data: JSON.stringify(data) });
      if (error) throw new Error(`Supabase Error: ${error.message}`);
      return res.json({ success: true });
    } else if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Configuration Supabase manquante sur Vercel." });
    } else {
      const database = await getDb();
      if (database) {
        database.prepare("UPDATE portfolio SET data = ? WHERE id = 1").run(JSON.stringify(data));
      }
      return res.json({ success: true });
    }
  } catch (err: any) {
    console.error("Save error:", err);
    return res.status(500).json({ error: err.message || "Erreur de sauvegarde" });
  }
});

app.post("/api/views", async (req, res) => {
  try {
    if (supabase) {
      const { data: current } = await supabase.from('views').select('count').eq('id', 1).single();
      const newCount = (current?.count || 0) + 1;
      await supabase.from('views').upsert({ id: 1, count: newCount });
      return res.json({ views: newCount });
    } else if (process.env.NODE_ENV === "production") {
      return res.json({ views: 0 });
    } else {
      const database = await getDb();
      if (database) {
        database.prepare("UPDATE views SET count = count + 1 WHERE id = 1").run();
        const views = database.prepare("SELECT count FROM views WHERE id = 1").get() as { count: number };
        return res.json({ views: views.count });
      }
      return res.json({ views: 0 });
    }
  } catch (err) {
    console.error("Views error:", err);
    return res.json({ views: 0 });
  }
});

export default app;

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development ONLY
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  // Note: In production, Vercel handles static files via vercel.json rewrites
}

startServer();
