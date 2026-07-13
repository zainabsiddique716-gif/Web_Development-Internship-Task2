import type { Theme } from "../types";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      className={[
        "flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium",
        "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]",
        "transition-transform duration-200 active:scale-95",
        "hover:bg-[var(--surface)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none outline-[var(--teal)]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 rounded-full transition-colors duration-200"
        style={{ background: isDark ? "var(--teal)" : "var(--amber)" }}
      />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
