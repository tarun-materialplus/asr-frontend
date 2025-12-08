import ThemeToggle from "../components/ui/ThemeToggle";
import { useUserStore } from "../store/userStore"; 

export default function Topbar() {
  const userName = useUserStore((s) => s.name);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-900 dark:text-white leading-none">{userName}</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Admin</div>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white dark:ring-slate-900">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}