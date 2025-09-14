// src/components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/70 backdrop-blur-md
                       dark:border-neutral-800/70 dark:bg-black/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-full overflow-hidden">
            <Image
              src="/adaptive-icon.png"
              alt="SavedIt app icon"
              width={36}
              height={36}
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/ios"
            className="rounded-full px-3 py-1.5 text-sm font-medium
                       bg-neutral-900 text-white hover:bg-black border border-transparent
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       dark:bg-white dark:text-black dark:hover:bg-neutral-200
                       dark:border-white/20 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_6px_24px_rgba(0,0,0,0.35)]"
          >
            Get iOS
          </Link>
          <Link
            href="/android"
            className="rounded-full px-3 py-1.5 text-sm font-medium
                       bg-neutral-900 text-white hover:bg-black border border-transparent
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       dark:bg-white dark:text-black dark:hover:bg-neutral-200
                       dark:border-white/20 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_6px_24px_rgba(0,0,0,0.35)]"
          >
            Get Android
          </Link>
        </div>
      </div>
    </header>
  );
}