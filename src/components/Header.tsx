// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

function ThemeToggleIcon() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <button className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-500">
        <Sun className="h-4 w-4" />
      </button>
    );
  }
  
  const effective = theme === "system" ? systemTheme : theme;
  
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };
  
  return (
    <button
      onClick={cycleTheme}
      className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
      title={`Theme: ${theme} (${effective})`}
    >
      {theme === "system" ? (
        <Monitor className="h-4 w-4" />
      ) : effective === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className={`mt-3 sm:mt-4 transition-all duration-300 ${isScrolled ? "mt-2 sm:mt-3" : ""}`}>
          <nav className={`flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 rounded-full transition-all duration-300 ${
            isScrolled 
              ? "bg-white/80 dark:bg-neutral-900/80 shadow-lg shadow-black/5 dark:shadow-black/20 border border-neutral-200/50 dark:border-white/10 backdrop-blur-xl" 
              : "bg-white/60 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-white/5 backdrop-blur-md"
          }`}>
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/adaptive-icon.png"
                  alt="SavedIt"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white hidden sm:block">
                SavedIt
              </span>
            </Link>

            {/* Desktop Nav - Center */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/#what">What</NavLink>
              <NavLink href="/#vision">Vision</NavLink>
              <NavLink href="/#get-app">Get app</NavLink>
              <NavLink href="/help">Help</NavLink>
            </div>

            {/* Actions - Right */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle - Desktop */}
              <div className="hidden sm:block">
                <ThemeToggleIcon />
              </div>
              
              {/* Divider - Desktop only */}
              <div className="hidden sm:block h-5 w-px bg-neutral-200 dark:bg-white/10 mx-1" />
              
              {/* App Buttons - Desktop */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="inline-flex h-8 items-center rounded-full px-3.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/ios"
                  className="inline-flex h-8 items-center rounded-full px-3.5 text-sm font-medium bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors"
                >
                  Get iOS
                </Link>
                <Link
                  href="/android"
                  className="inline-flex h-8 items-center rounded-full px-3.5 text-sm font-medium border border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                >
                  Android
                </Link>
              </div>

              {/* Mobile: Menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 px-4 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mt-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/50 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/30 backdrop-blur-xl overflow-hidden">
          <nav className="p-2">
            <Link
              href="/#what"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              What
            </Link>
            <Link
              href="/#vision"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              Vision
            </Link>
            <Link
              href="/#get-app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              Get app
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              Help
            </Link>
          </nav>
          
          <div className="border-t border-neutral-200/50 dark:border-white/10 p-3">
            {/* Theme row */}
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Theme</span>
              <ThemeToggleIcon />
            </div>
            
            {/* CTA Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center h-10 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/ios"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center h-10 rounded-xl text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 transition-colors"
              >
                iOS
              </Link>
              <Link
                href="/android"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center h-10 rounded-xl text-sm font-medium border border-neutral-300 dark:border-white/20 text-neutral-700 dark:text-white transition-colors"
              >
                Android
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
