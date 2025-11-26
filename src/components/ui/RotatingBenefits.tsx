"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface RotatingBenefitsProps {
  lines: string[];
  typeSpeed?: number;
  holdMs?: number;
  fadeMs?: number;
}

export function RotatingBenefits({
  lines,
  typeSpeed = 22,
  holdMs = 1200,
  fadeMs = 350,
}: RotatingBenefitsProps) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [fading, setFading] = useState(false);
  const [reduced, setReduced] = useState(false);
  const mounted = useRef(false);

  const line = useMemo(() => lines[i % lines.length], [i, lines]);

  useEffect(() => {
    mounted.current = true;
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
      const onChange = () => setReduced(mq.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    } catch {
      // SSR or older browsers: ignore
    }
  }, []);

  useEffect(() => {
    if (reduced) {
      // No typing; simple rotate every 1.6s
      setTyped(line);
      const t = setTimeout(() => setI((v) => (v + 1) % lines.length), 1600);
      return () => clearTimeout(t);
    }

    let t: ReturnType<typeof setTimeout> | undefined;
    if (typed.length < line.length) {
      t = setTimeout(() => setTyped(line.slice(0, typed.length + 1)), typeSpeed);
    } else {
      // fully typed → hold → fade → next
      const hold = setTimeout(() => {
        setFading(true);
        const afterFade = setTimeout(() => {
          setFading(false);
          setTyped("");
          setI((v) => (v + 1) % lines.length);
        }, fadeMs);
        t = afterFade as unknown as ReturnType<typeof setTimeout>;
      }, holdMs);
      t = hold;
    }
    return () => t && clearTimeout(t);
  }, [typed, line, lines.length, typeSpeed, holdMs, fadeMs, reduced]);

  return (
    <div
      aria-live="polite"
      className={`mt-3 flex min-h-6 items-center text-base text-neutral-700 transition-opacity duration-300 dark:text-neutral-200 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="break-words">{typed}</span>
      {/* caret */}
      {!reduced && (
        <span className="ml-1 inline-block h-5 w-[2px] flex-shrink-0 animate-pulse bg-current" />
      )}
    </div>
  );
}