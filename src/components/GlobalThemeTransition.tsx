// src/components/GlobalThemeTransition.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalThemeTransition() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<"light" | "dark">("light");
  const timer = useRef<number | null>(null);
  const edgeTimer = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    // initial
    setTarget(html.classList.contains("dark") ? "dark" : "light");

    const observer = new MutationObserver(() => {
      const next = html.classList.contains("dark") ? "dark" : "light";
      setTarget(next);
      // trigger overlay animation
      setShow(true);

      // end animation after duration
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShow(false), 800); // a hair longer than the CSS anim
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      if (timer.current) window.clearTimeout(timer.current);
      if (edgeTimer.current) window.clearTimeout(edgeTimer.current);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-[99999] will-change-transform
          ${target === "dark" ? "bg-gradient-to-br from-black to-neutral-900" : "bg-gradient-to-br from-white to-neutral-100"}
          savedit-peel-overlay
        `}
      />
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100000] h-[2px] w-[40vw] rounded-full bg-white/80 shadow-[0_0_12px_4px_rgba(255,255,255,0.7)] dark:bg-white/60 savedit-peel-edge"
      />

      {/* Scoped global CSS for the animation */}
      <style jsx global>{`
        @keyframes saveditPeelSweep {
          from { clip-path: polygon(0 0,100% 0,100% 100%,0 100%); opacity: 1; }
          to   { clip-path: polygon(100% 0,100% 0,100% 100%,100% 100%); opacity: 0; }
        }
        @keyframes saveditPeelEdge {
          from { transform: translate(0,0) rotate(35deg); opacity: 0.9; }
          to   { transform: translate(120vw,120vh) rotate(35deg); opacity: 0; }
        }
        .savedit-peel-overlay {
          animation: saveditPeelSweep 0.7s cubic-bezier(0.77, 0, 0.18, 1) forwards;
        }
        .savedit-peel-edge {
          animation: saveditPeelEdge 0.7s cubic-bezier(0.77, 0, 0.18, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .savedit-peel-overlay, .savedit-peel-edge {
            animation-duration: 0.001s !important;
          }
        }
      `}</style>
    </>
  );
}
