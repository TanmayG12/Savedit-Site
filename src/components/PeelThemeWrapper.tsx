"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Diagonal peel (top-left -> bottom-right) on theme change.
 * - Uses resolvedTheme ("light" | "dark")
 * - Fullscreen FIXED overlay hides repaint, then reveals diagonally
 * - Content gently fades/settles in
 */
export default function PeelThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [keyTheme, setKeyTheme] = useState<"light" | "dark">("light");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    setKeyTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme, mounted]);

  if (!mounted) return <>{children}</>;

  return (
    <div className="relative">
      {/* Content: soft settle */}
      <motion.div
        key={`content-${keyTheme}`}
        initial={{ opacity: 0.92, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      >
        {children}
      </motion.div>

      {/* Peel overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${keyTheme}`}
          initial={{ clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", opacity: 1 }}
          animate={{ clipPath: "polygon(100% 0,100% 0,100% 100%,100% 100%)", opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
          className={`pointer-events-none fixed inset-0 z-[9999] will-change-transform ${
            keyTheme === "dark"
              ? "bg-gradient-to-br from-black to-neutral-900"
              : "bg-gradient-to-br from-white to-neutral-100"
          }`}
        />

        {/* Bright diagonal edge for clarity */}
        <motion.div
          key={`edge-${keyTheme}`}
          initial={{ x: 0, y: 0, rotate: 35, opacity: 0.9 }}
          animate={{ x: "120vw", y: "120vh", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
          className="pointer-events-none fixed left-0 top-0 z-[10000] h-[2px] w-[40vw] rounded-full bg-white/80 shadow-[0_0_12px_4px_rgba(255,255,255,0.7)] dark:bg-white/60"
        />
      </AnimatePresence>
    </div>
  );
}