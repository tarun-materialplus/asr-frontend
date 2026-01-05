import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Clock, Key, Settings, BarChart2, Mic2, Video, Image, FileText, Music } from "lucide-react";
import clsx from "clsx";
import { useUIStore, type MediaType } from "../store/uiStore";

const ENRICHMENT_TYPES = [
  { id: "video", label: "Video Analysis", icon: Video },
  { id: "audio", label: "Audio Analysis", icon: Music },
  { id: "image", label: "Image Analysis", icon: Image },
  { id: "text",  label: "Text Analysis",  icon: FileText },
];

export default function Sidebar() {
  const activeType = useUIStore((s) => s.activeMediaType);
  const setType = useUIStore((s) => s.setActiveMediaType);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTypeClick = (type: MediaType) => {
    setType(type);
    if (location.pathname !== "/") {
        navigate("/");
    }
  };

  return (
    <aside className="w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-[#0f172a] text-slate-300 hidden md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-blue-500/20 shadow-lg">
          <Mic2 size={18} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">MediaCorp</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">AI Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <div className="px-3 mb-6">
          
          <button
            onClick={() => handleTypeClick("video")}
            className={clsx(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-2",
              location.pathname === "/" ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <div className="ml-4 space-y-1 border-l border-slate-800 pl-2">
            {ENRICHMENT_TYPES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTypeClick(item.id as MediaType)}
                className={clsx(
                  "group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  location.pathname === "/" && activeType === item.id 
                    ? "text-blue-400 bg-blue-500/10" 
                    : "text-slate-500 hover:text-slate-200"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 space-y-1">
          <NavLink to="/history" className={({ isActive }) => clsx("group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
            <Clock className="h-5 w-5" /> <span>File History</span>
          </NavLink>
          <NavLink to="/usage" className={({ isActive }) => clsx("group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
            <BarChart2 className="h-5 w-5" /> <span>Analytics</span>
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-4">
        <NavLink to="/keys" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Key className="h-4 w-4" /> <span>API Keys</span>
        </NavLink>
        <NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="h-4 w-4" /> <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}