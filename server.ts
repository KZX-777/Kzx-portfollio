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
  // Silent timeout: instead of rejecting, we resolve with null after 30s
  const timeoutPromise = new Promise((resolve) => 
    setTimeout(() => resolve(null), 30000)
  );

  try {
    if (supabase) {
      const fetchPromise = (async () => {
        try {
          const { data: portfolio, error: pError } = await supabase.from('portfolio').select('data').eq('id', 1).maybeSingle();
          const { data: views, error: vError } = await supabase.from('views').select('count').eq('id', 1).maybeSingle();
          
          if (pError) console.error("Supabase Portfolio Error:", pError);
          if (vError) console.error("Supabase Views Error:", vError);

          if (portfolio && portfolio.data) {
            try {
              return { 
                ...JSON.parse(portfolio.data), 
                views: views?.count || 0 
              };
            } catch (parseErr) {
              console.error("JSON Parse Error:", parseErr);
            }
          }
        } catch (innerErr) {
          console.error("Inner fetch error:", innerErr);
        }
        return null;
      })();

      const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
      if (result) return res.json(result);
    }
  } catch (err) {
    console.error("Unexpected fetch error:", err);
  }
  
  // Fallback to default data if anything goes wrong or times out
  return res.json({ ...DEFAULT_DATA, views: 0 });
});

app.post("/api/portfolio", async (req, res) => {
  const { password, data } = req.body;
  if (password !== "Ultraadmin275673@772") return res.status(401).json({ error: "Unauthorized" });

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Save timeout (30s) - Les données sont peut-être trop lourdes")), 30000)
  );

  try {
    if (!supabase) {
      const missing = [];
      if (!supabaseUrl || supabaseUrl === "undefined") missing.push("SUPABASE_URL");
      if (!supabaseKey || supabaseKey === "undefined") missing.push("SUPABASE_KEY");
      if (supabaseUrl && !supabaseUrl.startsWith('http')) missing.push("SUPABASE_URL (doit commencer par http)");
      throw new Error(`Supabase non configuré. Problème avec : ${missing.join(", ")}`);
    }

    const savePromise = (async () => {
      const { error } = await supabase.from('portfolio').upsert({ id: 1, data: JSON.stringify(data) });
      if (error) throw error;
      return { success: true };
    })();

    const result = await Promise.race([savePromise, timeoutPromise]) as any;
    res.json(result);
  } catch (err: any) {
    console.error("Save error:", err);
    let msg = err.message || "Erreur lors de la sauvegarde";
    if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("canceling statement")) {
      msg = "Données trop lourdes : Vos images ou vidéos dépassent la capacité de la base de données. Essayez de mettre des fichiers plus légers.";
    }
    res.status(500).json({ error: msg });
  }
});

app.post("/api/views", async (req, res) => {
  // Silent timeout for views
  const timeoutPromise = new Promise((resolve) => 
    setTimeout(() => resolve(null), 15000)
  );

  try {
    if (supabase) {
      const updatePromise = (async () => {
        try {
          const { data: current, error: fError } = await supabase.from('views').select('count').eq('id', 1).maybeSingle();
          if (fError) throw fError;
          
          const newCount = (current?.count || 0) + 1;
          const { error: uError } = await supabase.from('views').upsert({ id: 1, count: newCount });
          if (uError) throw uError;
          
          return { views: newCount };
        } catch (innerErr) {
          console.error("Inner views error:", innerErr);
          return null;
        }
      })();

      const result = await Promise.race([updatePromise, timeoutPromise]) as any;
      if (result) return res.json(result);
    }
  } catch (err) {
    console.error("Unexpected views error:", err);
  }
  res.json({ views: 0 });
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
