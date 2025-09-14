"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effective = theme === "system" ? systemTheme : theme;

  function fadeTo(color: "light" | "dark") {
    // Overlay that will fade away
    const overlay = document.createElement("div");
    overlay.className = "theme-fade-overlay";
    overlay.style.background = color === "dark" ? "#000" : "#fff";
    document.body.appendChild(overlay);

    // Fade out old content
    const root = document.getElementById("app-fade-root");
    if (root) root.classList.add("is-fading");

    // Flip theme immediately
    setTheme(color);

    // Allow DOM paint, then fade in content + fade out overlay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (root) root.classList.remove("is-fading");
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 1100); // match CSS duration
      });
    });
  }

  function handleClick() {
    const next = (effective === "dark" ? "light" : "dark") as "light" | "dark";
    fadeTo(next);
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleClick}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-900"
    >
      {effective === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{effective === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}