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
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

const isSupabaseValid = (url?: string, key?: string) => {
  if (!url || !key) return false;
  if (url === "undefined" || key === "undefined") return false;
  if (!url.startsWith('http')) return false;
  return true;
};

if (!isSupabaseValid(supabaseUrl, supabaseKey)) {
  console.warn("⚠️ ATTENTION : Supabase n'est pas configuré correctement. Les données ne seront pas sauvegardées.");
  console.warn("Vérifiez vos variables d'environnement SUPABASE_URL et SUPABASE_KEY sur Render.");
}

const supabase = isSupabaseValid(supabaseUrl, supabaseKey)
  ? createClient(supabaseUrl!, supabaseKey!) 
  : null;

const app = express();
app.use(express.json({ limit: '50mb' }));

app.get("/api/debug", (req, res) => {
  res.json({
    supabaseConfigured: !!supabase,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlValid: supabaseUrl?.startsWith('http') || false,
    urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : null,
    env: process.env.NODE_ENV || "development"
  });
});

const DEFAULT_DATA = {
  profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kzx",
  username: "Kzx_off",
  role: "Développeur Roblox & UI Designer",
  experience: "4 Mois d'Expérience Passionnée",
  discordTag: "kzx_off",
  email: "contact@kzx.dev",
  discordLink: "https://discord.com/users/kzx_off",
  robloxLink: "https://www.roblox.com/users/12345678/profile",
  githubLink: "https://github.com/Kzx-off",
  pricing: [
    { service: "Scripting (Roblox)", price: "À partir de 500 Robux" },
    { service: "UI Design (Roblox)", price: "À partir de 200 Robux" },
    { service: "Map Design", price: "Sur devis" },
  ],
  images: [],
  videos: [],
  customLinks: [],
  categories: [],
  musicUrl: null,
  musicTitle: null,
  backgroundUrl: null
};

// API Routes
app.get("/api/portfolio", async (req, res) => {
  try {
    if (supabase) {
      const { data: portfolio } = await supabase.from('portfolio').select('data').eq('id', 1).single();
      const { data: views } = await supabase.from('views').select('count').eq('id', 1).single();
      
      if (portfolio) {
        return res.json({ 
          ...JSON.parse(portfolio.data), 
          views: views?.count || 0 
        });
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
  
  // Return default data if Supabase is not configured or query fails
  res.json({ ...DEFAULT_DATA, views: 0 });
});

app.post("/api/portfolio", async (req, res) => {
  const { password, data } = req.body;
  if (password !== "Ultraadmin275673@772") return res.status(401).json({ error: "Unauthorized" });

  try {
    if (!supabase) {
      const missing = [];
      if (!supabaseUrl || supabaseUrl === "undefined") missing.push("SUPABASE_URL");
      if (!supabaseKey || supabaseKey === "undefined") missing.push("SUPABASE_KEY");
      if (supabaseUrl && !supabaseUrl.startsWith('http')) missing.push("SUPABASE_URL (doit commencer par http)");
      throw new Error(`Supabase non configuré. Problème avec : ${missing.join(", ")}`);
    }
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
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => console.log(`Dev Server: http://localhost:${PORT}`));
  } else {
    // Production: Serve static files from dist
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: "Not found" });
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
    app.listen(PORT, "0.0.0.0", () => console.log(`Production Server running on port ${PORT}`));
  }
}
startServer();
