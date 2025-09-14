// src/components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch
  const effective = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(effective === "dark" ? "light" : "dark")}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-900"
    >
      {mounted && effective === "dark" ? (
        <>
          <Moon size={16} />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun size={16} />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
}