import { NavLink } from "react-router-dom";
import { Home, Clock, Key, Settings, BarChart2, Mic2 } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/history", label: "File History", icon: Clock },
  { to: "/usage", label: "Usage Analytics", icon: BarChart2 },
  { to: "/keys", label: "API Keys", icon: Key },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-[#0f172a] text-slate-300 hidden md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-blue-500/20 shadow-lg">
          <Mic2 size={18} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">ASR</h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">ASR Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <NavLink 
          to="/settings"
          className={({ isActive }) => clsx(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
             isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5 opacity-70" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}