import { create } from "zustand";

type Theme = "light" | "dark";

type State = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

export const useThemeStore = create<State>((set) => {
  const initial = (localStorage.getItem("theme") as Theme) || "light";
  return {
    theme: initial,
    setTheme: (t: Theme) => {
      localStorage.setItem("theme", t);
      set({ theme: t });
    },
    toggle: () =>
      set((s) => {
        const next = s.theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", next);
        return { theme: next };
      }),
  };
});
