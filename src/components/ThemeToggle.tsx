
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <div className="theme-icon">
        <Sun className="h-5 w-5 theme-icon-sun" />
        <Moon className="h-5 w-5 theme-icon-moon" />
      </div>
    </button>
  );
}
