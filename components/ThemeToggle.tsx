// src/components/ThemeToggle.tsx
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

  function playPeel(next: "light" | "dark", duration = 700) {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.zIndex = "2147483647"; // max
    container.style.pointerEvents = "none";
    container.style.willChange = "transform";
    container.className = "savedit-peel-container";
    container.innerHTML = `
      <style>
        @keyframes saveditPeelSweep {
          from { clip-path: polygon(0 0,100% 0,100% 100%,0 100%); opacity: 1; }
          to   { clip-path: polygon(100% 0,100% 0,100% 100%,100% 100%); opacity: 0; }
        }
        @keyframes saveditPeelEdge {
          from { transform: translate(0,0) rotate(35deg); opacity: .95; }
          to   { transform: translate(120vw,120vh) rotate(35deg); opacity: 0; }
        }
        .savedit-peel-overlay {
          position: fixed; inset: 0;
          animation: saveditPeelSweep ${duration}ms cubic-bezier(.77,0,.18,1) forwards;
          background: ${next === "dark"
            ? "linear-gradient(135deg,#000,#111)"
            : "linear-gradient(135deg,#fff,#f6f6f6)"};
        }
        .savedit-peel-edge {
          position: fixed; left:0; top:0; height:2px; width:40vw; border-radius:9999px;
          background: rgba(255,255,255,0.85);
          box-shadow: 0 0 12px 4px rgba(255,255,255,0.7);
          animation: saveditPeelEdge ${duration}ms cubic-bezier(.77,0,.18,1) forwards;
        }
        .dark .savedit-peel-edge { background: rgba(255,255,255,0.7); }
        @media (prefers-reduced-motion: reduce) {
          .savedit-peel-overlay, .savedit-peel-edge { animation-duration: 1ms !important; }
        }
      </style>
      <div class="savedit-peel-overlay"></div>
      <div class="savedit-peel-edge"></div>
    `;
    document.body.appendChild(container);
    const cleanup = () => { container.remove(); };
    setTimeout(cleanup, duration + 50);
  }

  function handleClick() {
    const next = (effective === "dark" ? "light" : "dark") as "light" | "dark";
    // 1) Show peel overlay immediately
    playPeel(next, 700);
    // 2) Flip theme right away (repaint happens under the overlay)
    setTheme(next);
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