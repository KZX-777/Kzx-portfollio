import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Supabase Setup ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const app = express();
app.use(express.json({ limit: '50mb' }));

// API Routes
app.get("/api/portfolio", async (req, res) => {
  try {
    if (supabase) {
      const { data: portfolio } = await supabase.from('portfolio').select('data').eq('id', 1).single();
      const { data: views } = await supabase.from('views').select('count').eq('id', 1).single();
      return res.json({ 
        ...(portfolio ? JSON.parse(portfolio.data) : {}), 
        views: views?.count || 0 
      });
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
  res.json({ views: 0 });
});

app.post("/api/portfolio", async (req, res) => {
  const { password, data } = req.body;
  if (password !== "Ultraadmin275673@772") return res.status(401).json({ error: "Unauthorized" });

  try {
    if (!supabase) throw new Error("Supabase non configuré");
    const { error } = await supabase.from('portfolio').upsert({ id: 1, data: JSON.stringify(data) });
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/views", async (req, res) => {
  try {
    if (supabase) {
      const { data: current } = await supabase.from('views').select('count').eq('id', 1).single();
      const newCount = (current?.count || 0) + 1;
      await supabase.from('views').upsert({ id: 1, count: newCount });
      return res.json({ views: newCount });
    }
  } catch (err) {}
  res.json({ views: 0 });
});

export default app;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    app.listen(3000, "0.0.0.0", () => console.log("Server: http://localhost:3000"));
  }
}
startServer();
