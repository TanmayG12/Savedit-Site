// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-white/50 dark:text-neutral-200 dark:hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <div
          className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/50 bg-white/70 px-3 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-200 dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:h-14 sm:px-4"
        >
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/adaptive-icon.png"
                alt="SavedIt app icon"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-neutral-900 group-hover:opacity-90 dark:text-neutral-100">
              SavedIt
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/#what">What</NavLink>
            <NavLink href="/#vision">Vision</NavLink>
            <NavLink href="/#get-app">Get app</NavLink>
            <NavLink href="/help">Help</NavLink>
          </nav>

          {/* Actions (always visible, mobile + desktop) */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="compact" />
            <Link
              href="/ios"
              className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold
                       bg-neutral-900 text-white shadow-sm hover:bg-black
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400
                       dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Get iOS
            </Link>
            <Link
              href="/android"
              className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold
                       bg-neutral-900 text-white shadow-sm hover:bg-black
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400
                       dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Get Android
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
