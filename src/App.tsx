import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  Disc as Discord, 
  Clock, 
  DollarSign, 
  Play, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Music,
  Upload,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Eye,
  Lock,
  Unlock,
  Save,
  Edit2,
  Check,
  Github,
  Gamepad2,
  ExternalLink,
  Link,
  X
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, any> = {
  Mail,
  Discord,
  Github,
  Gamepad2,
  ExternalLink,
  Link,
  Play,
  ImageIcon,
  Music,
  DollarSign,
  Clock
};

// --- Types ---
interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  categoryId?: string;
}

interface PriceItem {
  service: string;
  price: string;
}

interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface Category {
  id: string;
  name: string;
}

interface PortfolioData {
  profileImg: string;
  backgroundUrl: string | null;
  images: MediaItem[];
  videos: MediaItem[];
  musicUrl: string | null;
  musicTitle: string | null;
  pricing: PriceItem[];
  email: string;
  views: number;
  username: string;
  role: string;
  experience: string;
  discordTag: string;
  discordLink: string;
  robloxLink: string;
  githubLink: string;
  customLinks: CustomLink[];
  categories: Category[];
}

// --- Components ---

const DiscordLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.68-.2758-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
);

const RobloxLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.8,19.7L5.2,16.8L7.2,3.2L20.8,6.1L18.8,19.7ZM15.6,10.2L11.5,9.3L10.6,13.4L14.7,14.3L15.6,10.2Z"/>
  </svg>
);

const GithubLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const SectionHeader: React.FC<{ title: string; icon?: any }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2.5 px-1 mb-4">
    <div className="w-1 h-3 bg-white/20 rounded-full" />
    {Icon && <Icon className="w-3 h-3 text-white/20" />}
    <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-display">{title}</h2>
  </div>
);

const MediaCard: React.FC<{ 
  item: MediaItem; 
  onRemove?: (id: string) => void; 
  onNameChange?: (id: string, name: string) => void;
  onCategoryChange?: (id: string, categoryId: string) => void;
  categories: Category[];
  isAdmin: boolean 
}> = ({ item, onRemove, onNameChange, onCategoryChange, categories, isAdmin }) => {
  return (
    <div className="glass rounded-2xl overflow-hidden relative group">
      {isAdmin && onRemove && (
        <button 
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 z-30 p-2 bg-red-500/20 backdrop-blur-md border border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/40"
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </button>
      )}
      
      <div className="aspect-video bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
        {item.type === 'video' ? (
          <>
            <video 
              src={item.url} 
              className="w-full h-full object-cover"
              muted
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent pointer-events-none">
              <Play className="w-8 h-8 text-white/40" />
            </div>
          </>
        ) : (
          <img 
            src={item.url} 
            alt={item.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-3 bg-white/[0.01] border-t border-white/[0.03]">
        {isAdmin && onNameChange ? (
          <div className="space-y-2">
            <input 
              type="text"
              value={item.name}
              onChange={(e) => onNameChange(item.id, e.target.value)}
              placeholder="Ajouter une description..."
              className="w-full bg-transparent text-[7px] font-bold text-white/40 uppercase tracking-[0.2em] text-center outline-none focus:text-white/80 transition-colors"
            />
            {onCategoryChange && (
              <select
                value={item.categoryId || ""}
                onChange={(e) => onCategoryChange(item.id, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg text-[8px] text-white/40 uppercase tracking-widest outline-none px-2 py-1 focus:border-white/20 transition-all"
              >
                <option value="">Aucune catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="text-[7px] font-bold text-white/20 uppercase tracking-[0.2em] text-center">
            {item.name || "Sans titre"}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [loginStep, setLoginStep] = useState(1);
  const [loginError, setLoginError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  
  const [data, setData] = useState<PortfolioData>({
    profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kzx",
    backgroundUrl: null,
    images: [],
    videos: [],
    musicUrl: null,
    musicTitle: null,
    pricing: [
      { service: "Scripting (Roblox)", price: "À partir de 500 Robux" },
      { service: "UI Design (Roblox)", price: "À partir de 200 Robux" },
      { service: "Map Design", price: "Sur devis" },
    ],
    email: "contact@kzx.dev",
    views: 0,
    username: "Kzx_off",
    role: "Développeur Roblox & UI Designer",
    experience: "4 Mois d'Expérience Passionnée",
    discordTag: "kzx_off",
    discordLink: "https://discord.com/users/kzx_off",
    robloxLink: "https://www.roblox.com/users/12345678/profile",
    githubLink: "https://github.com/Kzx-off",
    customLinks: [],
    categories: []
  });

  const [showMedia, setShowMedia] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("https://");
  const [newLinkIcon, setNewLinkIcon] = useState("Link");
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Cooldown effect
  useEffect(() => {
    if (!cooldownUntil) return;
    
    const interval = setInterval(() => {
      if (Date.now() >= cooldownUntil) {
        setCooldownUntil(null);
        setLoginError("");
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json && Object.keys(json).length > 1) {
          setData(prev => ({ ...prev, ...json }));
        }
        
        // Increment views
        const viewRes = await fetch("/api/views", { method: "POST" });
        const viewJson = await viewRes.json();
        setData(prev => ({ ...prev, views: viewJson.views }));
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    };
    fetchData();
  }, []);

  // Handle Music Play/Pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Save data to backend
  const saveToBackend = async (newData: PortfolioData) => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, data: newData })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erreur ${res.status}`;
        
        if (res.status === 401) {
          setIsAdmin(false);
          throw new Error("Session expirée ou mot de passe incorrect.");
        }
        throw new Error(errorMessage);
      }
    } catch (e: any) {
      console.error("Save error:", e);
      alert(e.message || "Erreur lors de la sauvegarde. Vérifiez votre connexion.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle File Selections
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'music' | 'image' | 'video') => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size for videos (max 5MB to be safe with Base64 overhead)
    if (type === 'video' && file.size > 5 * 1024 * 1024) {
      alert("Cette vidéo est trop lourde (max 5Mo). Veuillez la compresser avant de l'ajouter.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      let base64 = event.target?.result as string;

      // Compress images if they are large
      if (type === 'image' || type === 'profile') {
        try {
          base64 = await compressImage(base64);
        } catch (err) {
          console.error("Compression failed", err);
        }
      }

      let newData = { ...data };
      if (type === 'profile') {
        newData.profileImg = base64;
      } else if (type === 'music') {
        newData.musicUrl = base64;
        setIsPlaying(false);
      } else if (type === 'image') {
        newData.images = [...data.images, { id: Math.random().toString(), type: 'image', url: base64, name: file.name }];
      } else if (type === 'video') {
        newData.videos = [...data.videos, { id: Math.random().toString(), type: 'video', url: base64, name: file.name }];
      }
      
      setData(newData);
      saveToBackend(newData);
    };
    reader.readAsDataURL(file);
  };

  // Helper to compress images using canvas
  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimension 1200px
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality
      };
    });
  };

  const removeMedia = (id: string, type: 'image' | 'video') => {
    if (!isAdmin) return;
    let newData = { ...data };
    if (type === 'image') {
      newData.images = data.images.filter(item => item.id !== id);
    } else {
      newData.videos = data.videos.filter(item => item.id !== id);
    }
    setData(newData);
    saveToBackend(newData);
  };

  const updateMediaName = (id: string, type: 'image' | 'video', newName: string) => {
    if (!isAdmin) return;
    const newData = { ...data };
    if (type === 'image') {
      newData.images = data.images.map(item => item.id === id ? { ...item, name: newName } : item);
    } else {
      newData.videos = data.videos.map(item => item.id === id ? { ...item, name: newName } : item);
    }
    setData(newData);
    saveToBackend(newData);
  };

  const updatePrice = (index: number, field: 'service' | 'price', value: string) => {
    if (!isAdmin) return;
    const newPricing = [...data.pricing];
    newPricing[index][field] = value;
    const newData = { ...data, pricing: newPricing };
    setData(newData);
    saveToBackend(newData);
  };

  const addPriceItem = () => {
    if (!isAdmin) return;
    const newData = { ...data, pricing: [...data.pricing, { service: "Nouveau Service", price: "0€" }] };
    setData(newData);
    saveToBackend(newData);
  };

  const removePriceItem = (index: number) => {
    if (!isAdmin) return;
    const newData = { ...data, pricing: data.pricing.filter((_, i) => i !== index) };
    setData(newData);
    saveToBackend(newData);
  };

  const updateField = (field: keyof PortfolioData, value: any) => {
    if (!isAdmin) return;
    const newData = { ...data, [field]: value };
    setData(newData);
    saveToBackend(newData);
  };

  const addCategory = () => {
    if (!isAdmin || !newCategoryName.trim()) return;
    const newCat = { id: Math.random().toString(), name: newCategoryName.trim() };
    const newData = { ...data, categories: [...data.categories, newCat] };
    setData(newData);
    saveToBackend(newData);
    setNewCategoryName("");
    setShowAddCategoryForm(false);
  };

  const removeCategory = (id: string) => {
    if (!isAdmin) return;
    const newData = { 
      ...data, 
      categories: data.categories.filter(c => c.id !== id),
      images: data.images.map(img => img.categoryId === id ? { ...img, categoryId: undefined } : img),
      videos: data.videos.map(vid => vid.categoryId === id ? { ...vid, categoryId: undefined } : vid)
    };
    setData(newData);
    saveToBackend(newData);
  };

  const updateCategoryName = (id: string, name: string) => {
    if (!isAdmin) return;
    const newData = { 
      ...data, 
      categories: data.categories.map(c => c.id === id ? { ...c, name } : c)
    };
    setData(newData);
    saveToBackend(newData);
  };

  const updateMediaCategory = (id: string, type: 'image' | 'video', categoryId: string) => {
    if (!isAdmin) return;
    const newData = { ...data };
    const catId = categoryId === "" ? undefined : categoryId;
    if (type === 'image') {
      newData.images = data.images.map(item => item.id === id ? { ...item, categoryId: catId } : item);
    } else {
      newData.videos = data.videos.map(item => item.id === id ? { ...item, categoryId: catId } : item);
    }
    setData(newData);
    saveToBackend(newData);
  };

  const addCustomLink = () => {
    if (!isAdmin || !newLinkTitle.trim()) return;
    const newLink = { 
      id: Math.random().toString(), 
      title: newLinkTitle.trim(), 
      url: newLinkUrl.trim(), 
      icon: newLinkIcon 
    };
    const newData = { ...data, customLinks: [...data.customLinks, newLink] };
    setData(newData);
    saveToBackend(newData);
    setNewLinkTitle("");
    setNewLinkUrl("https://");
    setNewLinkIcon("Link");
    setShowAddLinkForm(false);
  };

  const removeCustomLink = (id: string) => {
    if (!isAdmin) return;
    const newData = { ...data, customLinks: data.customLinks.filter(l => l.id !== id) };
    setData(newData);
    saveToBackend(newData);
  };

  const updateCustomLink = (id: string, field: keyof CustomLink, value: string) => {
    if (!isAdmin) return;
    const newData = { 
      ...data, 
      customLinks: data.customLinks.map(l => l.id === id ? { ...l, [field]: value } : l)
    };
    setData(newData);
    saveToBackend(newData);
  };

  const handleAdminLogin = () => {
    if (cooldownUntil && Date.now() < cooldownUntil) {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      setLoginError(`Trop d'échecs. Attendez ${remaining}s`);
      return;
    }

    setLoginError("");
    if (loginStep === 1) {
      if (adminPassword === "Ultraadmin275673@772") {
        setLoginStep(2);
        setLoginError("");
      } else {
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        if (newFailed >= 5) {
          setCooldownUntil(Date.now() + 60000);
          setFailedAttempts(0);
          setLoginError("Sécurité activée : Attendez 1 min");
        } else {
          setLoginError(`Mot de passe incorrect (${newFailed}/5)`);
        }
      }
    } else {
      if (adminPin === "2756") {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setLoginStep(1);
        setAdminPin("");
        setFailedAttempts(0);
        setCooldownUntil(null);
      } else {
        const newFailed = failedAttempts + 1;
        setFailedAttempts(newFailed);
        if (newFailed >= 5) {
          setCooldownUntil(Date.now() + 60000);
          setFailedAttempts(0);
          setLoginStep(1);
          setAdminPassword("");
          setAdminPin("");
          setLoginError("Sécurité activée : Attendez 1 min");
        } else {
          setLoginError(`Code PIN incorrect (${newFailed}/5)`);
        }
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-white/10 relative overflow-hidden"
      style={data.backgroundUrl ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${data.backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Background Glows */}
      {!data.backgroundUrl && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-white/[0.01] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-white/[0.01] rounded-full blur-[120px]" />
        </div>
      )}

      <div className="w-full max-w-[420px] z-10 space-y-4">
        {/* Profile Card */}
        <div className="glass rounded-[2rem] p-8 text-center relative overflow-hidden noise-bg">
          {/* Top Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            {data.musicUrl && (
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={toggleMusic}
                  className="flex items-center justify-center w-8 h-8 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-all"
                >
                  {isPlaying ? (
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-white/30" />
                  )}
                </button>
                {data.musicTitle && (
                  <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest animate-pulse">
                    ♫ {data.musicTitle}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
            <Eye className="w-3 h-3" /> {data.views}
          </div>

          <div 
            className={`relative w-24 h-24 mx-auto mb-6 group cursor-pointer`} 
            onClick={() => {
              if (isAdmin) {
                profileInputRef.current?.click();
              } else {
                const newCount = adminClickCount + 1;
                setAdminClickCount(newCount);
                if (newCount >= 5) {
                  setShowAdminButton(!showAdminButton);
                  setAdminClickCount(0);
                }
              }
            }}
          >
            <div className="absolute inset-0 bg-white/[0.01] rounded-full" />
            <img 
              src={data.profileImg} 
              alt="Profile" 
              className="relative w-full h-full rounded-full border border-white/[0.05] object-cover group-hover:opacity-70 transition-opacity"
            />
            {isAdmin && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-5 h-5" />
              </div>
            )}
            <input 
              type="file" 
              ref={profileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleFileChange(e, 'profile')} 
            />
          </div>
          
          {isAdmin ? (
            <input 
              type="text"
              value={data.username}
              onChange={(e) => updateField('username', e.target.value)}
              className="text-3xl font-display font-bold mb-1 glow-text bg-transparent text-center outline-none w-full tracking-tight"
            />
          ) : (
            <h1 className="text-3xl font-display font-bold mb-1 glow-text tracking-tight">{data.username}</h1>
          )}

          {isAdmin ? (
            <input 
              type="text"
              value={data.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="text-white/30 text-[10px] mb-6 uppercase tracking-[0.3em] font-medium bg-transparent text-center outline-none w-full"
            />
          ) : (
            <p className="text-white/30 text-[10px] mb-6 uppercase tracking-[0.3em] font-medium">{data.role}</p>
          )}
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" /> 
              {isAdmin ? (
                <input 
                  type="text"
                  value={data.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  className="bg-transparent outline-none w-24"
                />
              ) : (
                data.experience
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold uppercase tracking-wider">
              <DiscordLogo className="w-3 h-3" /> 
              {isAdmin ? (
                <input 
                  type="text"
                  value={data.discordTag}
                  onChange={(e) => updateField('discordTag', e.target.value)}
                  className="bg-transparent outline-none w-20"
                />
              ) : (
                data.discordTag
              )}
            </div>
          </div>

          {/* Contact Section - Aesthetic & Prominent */}
          <div className="mt-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/10" />
              <h2 className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 font-display">Get in Touch</h2>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/10" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {isAdmin ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-xs">
                    <Mail className="w-4 h-4 text-emerald-400/60" />
                    <input 
                      type="text"
                      value={data.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="bg-transparent outline-none w-full text-[10px] text-white/80"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-xs">
                    <DiscordLogo className="w-4 h-4 text-indigo-400/60" />
                    <input 
                      type="text"
                      value={data.discordLink}
                      onChange={(e) => updateField('discordLink', e.target.value)}
                      className="bg-transparent outline-none w-full text-[10px] text-white/80"
                      placeholder="Lien Discord"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <a 
                    href={`mailto:${data.email}`}
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/[0.05] hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 rounded-xl border border-emerald-500/10 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-[7px] text-white/20 uppercase tracking-[0.2em] font-bold mb-0.5">Professional</p>
                        <p className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors">Contact par Email</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/10 -rotate-90 group-hover:translate-x-1 transition-all" />
                  </a>

                  <a 
                    href={data.discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/[0.05] hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 rounded-xl border border-indigo-500/10 group-hover:scale-110 transition-transform">
                        <DiscordLogo className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-[7px] text-white/20 uppercase tracking-[0.2em] font-bold mb-0.5">Community</p>
                        <p className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors">Rejoindre le Discord</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/10 -rotate-90 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Other Links Section - Compact & Minimal */}
          <div className="mt-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-4 bg-white/5" />
              <h2 className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">Socials & Links</h2>
              <div className="h-[1px] w-4 bg-white/5" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {isAdmin ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2 py-2.5 px-3 bg-white/5 rounded-2xl border border-white/5 font-bold text-xs">
                    <GithubLogo className="w-4 h-4 text-white/40" />
                    <input 
                      type="text"
                      value={data.githubLink}
                      onChange={(e) => updateField('githubLink', e.target.value)}
                      className="bg-transparent outline-none w-full text-[10px]"
                      placeholder="Lien GitHub"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-2.5 px-3 bg-white/5 rounded-2xl border border-white/5 font-bold text-xs">
                    <RobloxLogo className="w-4 h-4 text-white/40" />
                    <input 
                      type="text"
                      value={data.robloxLink}
                      onChange={(e) => updateField('robloxLink', e.target.value)}
                      className="bg-transparent outline-none w-full text-[10px]"
                      placeholder="Lien Roblox"
                    />
                  </div>
                  
                  {/* Custom Links Admin */}
                  {data.customLinks.map(link => (
                    <div key={link.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Lien Personnalisé</span>
                        <button onClick={() => removeCustomLink(link.id)} className="text-red-400/40 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={link.icon}
                          onChange={(e) => updateCustomLink(link.id, 'icon', e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none px-2 py-1"
                        >
                          {Object.keys(AVAILABLE_ICONS).map(iconName => (
                            <option key={iconName} value={iconName}>{iconName}</option>
                          ))}
                        </select>
                        <input 
                          type="text"
                          value={link.title}
                          onChange={(e) => updateCustomLink(link.id, 'title', e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                          placeholder="Titre"
                        />
                      </div>
                      <input 
                        type="text"
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                        placeholder="URL"
                      />
                    </div>
                  ))}

                  {/* Add New Link Form */}
                  {showAddLinkForm ? (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Nouveau Lien</span>
                        <button onClick={() => setShowAddLinkForm(false)} className="text-white/20 hover:text-white/60 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <select 
                          value={newLinkIcon}
                          onChange={(e) => setNewLinkIcon(e.target.value)}
                          className="bg-white/10 border border-white/10 rounded-lg text-[10px] text-white outline-none px-2 py-1"
                        >
                          {Object.keys(AVAILABLE_ICONS).map(iconName => (
                            <option key={iconName} value={iconName}>{iconName}</option>
                          ))}
                        </select>
                        <input 
                          type="text"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                          className="flex-1 bg-white/10 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                          placeholder="Titre du lien..."
                        />
                      </div>
                      <input 
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                        placeholder="URL (https://...)"
                      />
                      <button 
                        onClick={addCustomLink}
                        disabled={!newLinkTitle.trim()}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/30 transition-all text-[9px] font-bold uppercase tracking-widest text-emerald-400 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" /> Confirmer le Lien
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAddLinkForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-[9px] font-bold uppercase tracking-widest text-white/40"
                    >
                      <Plus className="w-3 h-3" /> Ajouter un Lien
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href={data.robloxLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.1] hover:scale-110 transition-all group"
                    title="Roblox"
                  >
                    <RobloxLogo className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href={data.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.1] hover:scale-110 transition-all group"
                    title="GitHub"
                  >
                    <GithubLogo className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </a>
                  {data.customLinks.map(link => {
                    const Icon = AVAILABLE_ICONS[link.icon] || Link;
                    return (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.1] hover:scale-110 transition-all group"
                        title={link.title}
                      >
                        <Icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {isAdmin && (
              <div className="space-y-2">
                <button 
                  onClick={() => musicInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all font-bold text-xs"
                >
                  <Music className="w-4 h-4" /> {data.musicUrl ? "Changer la Musique" : "Ajouter une Musique"}
                </button>
                {data.musicUrl && (
                  <input 
                    type="text"
                    placeholder="Titre de la musique (Crédits)..."
                    value={data.musicTitle || ""}
                    onChange={(e) => updateField('musicTitle', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-[10px] text-white outline-none px-4 py-2 focus:border-white/20 transition-all text-center"
                  />
                )}
              </div>
            )}
            
            <input 
              type="file" 
              ref={musicInputRef} 
              className="hidden" 
              accept="audio/mp3,audio/*" 
              onChange={(e) => handleFileChange(e, 'music')} 
            />
            {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop className="hidden" />}
          </div>
        </div>

        {/* Media Section */}
        <div className="glass rounded-3xl p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <button 
              onClick={() => setShowMedia(!showMedia)}
              className="flex items-center gap-3 font-display font-bold text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/80 transition-all"
            >
              <div className="w-1 h-3 bg-white/20 rounded-full" />
              Mes Réalisations
              {showMedia ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowMedia(true);
                    setShowAddCategoryForm(true);
                  }} 
                  className="p-1.5 glass rounded-lg hover:bg-white/10 transition-all" 
                  title="Ajouter Catégorie"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => imageInputRef.current?.click()} className="p-1.5 glass rounded-lg hover:bg-white/10 transition-all" title="Ajouter Image">
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => videoInputRef.current?.click()} className="p-1.5 glass rounded-lg hover:bg-white/10 transition-all" title="Ajouter Vidéo">
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
            <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
          </div>
          
          {showMedia && (
            <div className="space-y-8">
              {/* Categories Admin */}
              {isAdmin && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4 text-left">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Gérer les Catégories</span>
                  
                  {/* Existing Categories */}
                  <div className="space-y-2">
                    {data.categories.map(cat => (
                      <div key={cat.id} className="flex gap-2">
                        <input 
                          type="text"
                          value={cat.name}
                          onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                        />
                        <button onClick={() => removeCategory(cat.id)} className="p-1.5 text-red-400/40 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Category Form */}
                  {showAddCategoryForm ? (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Nouvelle Catégorie</span>
                        <button onClick={() => setShowAddCategoryForm(false)} className="text-white/20 hover:text-white/60 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          autoFocus
                          className="flex-1 bg-white/10 border border-white/10 rounded-lg text-[10px] text-white outline-none px-3 py-1"
                          placeholder="Nom de la catégorie..."
                          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                        />
                        <button 
                          onClick={addCategory}
                          disabled={!newCategoryName.trim()}
                          className="px-4 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/30 transition-all text-[9px] font-bold uppercase tracking-widest text-emerald-400 disabled:opacity-50"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAddCategoryForm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-[9px] font-bold uppercase tracking-widest text-white/40"
                    >
                      <Plus className="w-3 h-3" /> Créer une Catégorie
                    </button>
                  )}
                </div>
              )}

              {/* Grouped Media */}
              {data.categories.map(cat => {
                const catImages = data.images.filter(img => img.categoryId === cat.id);
                const catVideos = data.videos.filter(vid => vid.categoryId === cat.id);
                if (catImages.length === 0 && catVideos.length === 0 && !isAdmin) return null;

                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-1 h-3 bg-emerald-500/40 rounded-full" />
                      <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{cat.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {catImages.map(img => (
                        <MediaCard 
                          key={img.id} 
                          item={img} 
                          onRemove={(id) => removeMedia(id, 'image')} 
                          onNameChange={(id, name) => updateMediaName(id, 'image', name)}
                          onCategoryChange={(id, catId) => updateMediaCategory(id, 'image', catId)}
                          categories={data.categories}
                          isAdmin={isAdmin} 
                        />
                      ))}
                      {catVideos.map(vid => (
                        <MediaCard 
                          key={vid.id} 
                          item={vid} 
                          onRemove={(id) => removeMedia(id, 'video')} 
                          onNameChange={(id, name) => updateMediaName(id, 'video', name)}
                          onCategoryChange={(id, catId) => updateMediaCategory(id, 'video', catId)}
                          categories={data.categories}
                          isAdmin={isAdmin} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Default Sections (Uncategorized) */}
              {(data.images.filter(img => !img.categoryId).length > 0 || isAdmin) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-1 h-3 bg-white/10 rounded-full" />
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Images</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {data.images.filter(img => !img.categoryId).map(img => (
                      <MediaCard 
                        key={img.id} 
                        item={img} 
                        onRemove={(id) => removeMedia(id, 'image')} 
                        onNameChange={(id, name) => updateMediaName(id, 'image', name)}
                        onCategoryChange={(id, catId) => updateMediaCategory(id, 'image', catId)}
                        categories={data.categories}
                        isAdmin={isAdmin} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {(data.videos.filter(vid => !vid.categoryId).length > 0 || isAdmin) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-1 h-3 bg-white/10 rounded-full" />
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Vidéos</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {data.videos.filter(vid => !vid.categoryId).map(vid => (
                      <MediaCard 
                        key={vid.id} 
                        item={vid} 
                        onRemove={(id) => removeMedia(id, 'video')} 
                        onNameChange={(id, name) => updateMediaName(id, 'video', name)}
                        onCategoryChange={(id, catId) => updateMediaCategory(id, 'video', catId)}
                        categories={data.categories}
                        isAdmin={isAdmin} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {data.images.length === 0 && data.videos.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Aucun média ajouté</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="glass rounded-[2rem] p-6 noise-bg">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-4 bg-white/20 rounded-full" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-display">Services & Tarifs</h2>
            </div>
            {isAdmin && (
              <button 
                onClick={addPriceItem} 
                className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 border border-white/5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="space-y-2.5">
            {data.pricing.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3.5 bg-white/[0.02] rounded-2xl border border-white/[0.05] group hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center gap-3 flex-1">
                  {isAdmin ? (
                    <div className="flex items-center gap-2 w-full">
                      <button 
                        onClick={() => removePriceItem(idx)} 
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/10 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        type="text"
                        value={item.service}
                        onChange={(e) => updatePrice(idx, 'service', e.target.value)}
                        className="text-xs font-medium bg-transparent outline-none w-full"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-white/80">{item.service}</span>
                  )}
                </div>
                <div className="flex items-center">
                  {isAdmin ? (
                    <input 
                      type="text"
                      value={item.price}
                      onChange={(e) => updatePrice(idx, 'price', e.target.value)}
                      className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-lg text-white border border-white/5 outline-none w-20 text-center focus:border-white/20 transition-all"
                    />
                  ) : (
                    <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-lg text-white/50 border border-white/5">
                      {item.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-5 text-[9px] text-center text-white/10 uppercase tracking-widest font-medium">
            * Tarifs variables selon la complexité
          </p>
        </div>

        {/* Admin Background Control */}
        {isAdmin && (
          <div className="glass rounded-2xl p-4 noise-bg space-y-3">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-1 h-3 bg-white/20 rounded-full" />
              <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-display">Background Settings</h2>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Background Image URL (leave empty for default)"
                value={data.backgroundUrl || ""}
                onChange={(e) => updateField('backgroundUrl', e.target.value || null)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-[10px] outline-none px-4 py-2.5 focus:border-white/20 transition-all"
              />
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="glass rounded-2xl p-4 flex items-center justify-between noise-bg">
          <div className="flex items-center gap-3 flex-1 px-1">
            <Mail className="w-3.5 h-3.5 text-white/20" />
            {isAdmin ? (
              <input 
                type="text"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="text-[10px] text-white bg-transparent outline-none w-full"
              />
            ) : (
              <span className="text-[10px] text-white/40 font-medium tracking-wide">{data.email}</span>
            )}
          </div>
          <div className="text-[9px] text-white/10 font-mono tracking-tighter">
            EST. 2024 • V1.2.0
          </div>
        </div>

        {/* Admin Section */}
        {(isAdmin || showAdminButton) && (
          <div className="pt-4 flex flex-col items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 rounded-2xl border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-widest shadow-lg shadow-green-500/5">
                <Unlock className="w-3.5 h-3.5" /> 
                <span>Mode Admin Actif {isSaving && "• Sauvegarde..."}</span>
                <button 
                  onClick={() => {
                    setIsAdmin(false);
                    setShowAdminButton(false);
                    setAdminClickCount(0);
                    setLoginStep(1);
                    setLoginError("");
                  }} 
                  className="ml-2 px-3 py-1 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-all active:scale-95"
                >
                  Ok
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setShowAdminLogin(!showAdminLogin);
                  setLoginStep(1);
                  setAdminPassword("");
                  setAdminPin("");
                  setLoginError("");
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white/60 transition-all"
              >
                <Lock className="w-3 h-3" /> {showAdminLogin ? "Annuler" : "Admin"}
              </button>
            )}

            {showAdminLogin && (
              <div className="glass p-4 rounded-[2rem] flex flex-col gap-3 noise-bg border-white/10">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      type={loginStep === 1 ? "password" : "text"} 
                      placeholder={loginStep === 1 ? "Password" : "PIN Code"}
                      value={loginStep === 1 ? adminPassword : adminPin}
                      onChange={(e) => {
                        setLoginError("");
                        loginStep === 1 ? setAdminPassword(e.target.value) : setAdminPin(e.target.value);
                      }}
                      className="bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono outline-none px-4 py-2.5 w-40 focus:border-white/20 transition-all"
                      maxLength={loginStep === 2 ? 4 : undefined}
                    />
                    <button 
                      onClick={handleAdminLogin}
                      disabled={!!cooldownUntil && Date.now() < cooldownUntil}
                      className={`p-2.5 rounded-xl transition-all ${
                        cooldownUntil && Date.now() < cooldownUntil 
                          ? "bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/20" 
                          : "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                  {loginError && (
                    <p className="text-[8px] text-red-400 font-bold uppercase tracking-[0.2em] text-center">
                      {loginError}
                    </p>
                  )}
                  {loginStep === 2 && !loginError && (
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] text-center font-bold">Step 2: Enter PIN</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="pt-4 text-center">
          <p className="text-[9px] text-white/10 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} • Kzx_off
          </p>
        </footer>
      </div>
    </div>
  );
}
