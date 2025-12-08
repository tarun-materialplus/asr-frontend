
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="p-2 rounded-lg bg-gray-100 dark:bg-[#0b2530] hover:opacity-90"
    >
      {theme === "light" ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-yellow-300" />}
    </button>
  );
}
