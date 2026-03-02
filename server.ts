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

let cachedPortfolio: any = { ...DEFAULT_DATA, views: 0 };
let isInitialLoadDone = false;

// Background sync with Supabase
const syncFromSupabase = async () => {
  if (!supabase) return;
  try {
    const { data: portfolio } = await supabase.from('portfolio').select('data').eq('id', 1).maybeSingle();
    const { data: views } = await supabase.from('views').select('count').eq('id', 1).maybeSingle();
    
    if (portfolio && portfolio.data) {
      const parsed = JSON.parse(portfolio.data);
      cachedPortfolio = { 
        ...parsed, 
        views: views?.count || 0 
      };
      isInitialLoadDone = true;
    }
  } catch (err) {
    console.error("Initial sync error:", err);
  }
};

// Start initial sync
syncFromSupabase();

// Periodically sync from Supabase every 5 minutes to ensure cache consistency
setInterval(syncFromSupabase, 5 * 60 * 1000);

// API Routes
app.get("/api/portfolio", async (req, res) => {
  // Prevent browser caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Return cached data immediately for instant response
  res.json(cachedPortfolio);
  
  // Background refresh if not done yet
  if (!isInitialLoadDone) {
    syncFromSupabase();
  }
});

app.post("/api/portfolio", async (req, res) => {
  const { password, data } = req.body;
  if (password !== "Ultraadmin275673@772") return res.status(401).json({ error: "Unauthorized" });

  // Update cache INSTANTLY
  cachedPortfolio = { ...data, views: cachedPortfolio.views };

  // Background save to Supabase
  const saveToSupabase = async () => {
    if (!supabase) return;
    try {
      await supabase.from('portfolio').upsert({ id: 1, data: JSON.stringify(data) });
    } catch (err) {
      console.error("Background save error:", err);
    }
  };
  
  saveToSupabase();
  res.json({ success: true, message: "Sauvegarde en cours (instantané en cache)" });
});

app.post("/api/views", async (req, res) => {
  // Increment cache instantly
  cachedPortfolio.views += 1;
  res.json({ views: cachedPortfolio.views });

  // Background save to Supabase
  const saveViewsToSupabase = async () => {
    if (!supabase) return;
    try {
      await supabase.from('views').upsert({ id: 1, count: cachedPortfolio.views });
    } catch (err) {
      console.error("Background views save error:", err);
    }
  };
  
  saveViewsToSupabase();
});

export default app;

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({ 
        server: { middlewareMode: true }, 
        appType: "spa" 
      });
      app.use(vite.middlewares);
      console.log("Vite middleware loaded");
    } catch (e) {
      console.error("Failed to load Vite middleware:", e);
    }
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: "Not found" });
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  }).on('error', (err) => {
    console.error("Server failed to start:", err);
  });
}

startServer().catch(err => {
  console.error("Critical startup error:", err);
});
