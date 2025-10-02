"use client";

import { useEffect, useState } from "react";

export type HelpHeroProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  resultsCount: number;
};

export default function HelpHero({ inputValue, onInputChange, resultsCount }: HelpHeroProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-3xl border border-line/60 bg-white/70 p-8 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-softdark">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">
            Support Center
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-light dark:text-white sm:text-4xl">
            Help & FAQs
          </h1>
          <p className="max-w-2xl text-base text-text-dim dark:text-text-dark/80">
            Welcome to SavedIt! Here’s a quick guide to get the most out of your saved content.
          </p>
        </div>
        <label className="group block">
          <span className="sr-only">Search FAQs</span>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-dim/80 dark:text-text-dark/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
            <input
              type="search"
              aria-label="Search FAQs"
              placeholder="Search by question, feature, or keyword"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full rounded-2xl border border-line/70 bg-white/90 py-4 pl-12 pr-4 text-base text-text-light transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-text-dark/60"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
          {isMounted && (
            <p className="mt-2 text-sm text-text-dim dark:text-text-dark/70">
              {resultsCount === 1 ? "Showing 1 result" : `Showing ${resultsCount} results`}
            </p>
          )}
        </label>
      </div>
    </section>
  );
}