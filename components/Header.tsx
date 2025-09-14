'use client'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-black/30">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            S
          </span>
          <span className="font-medium tracking-wide">SavedIt</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-text-dim">
          <a href="#what" className="hover:underline">What</a>
          <a href="#how" className="hover:underline">How</a>
          <a href="#vision" className="hover:underline">Vision</a>
          <a href="#get" className="hover:underline">Get app</a>
          <Link href="/help" className="hover:underline">Help</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/ios" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Get iOS</Link>
        </div>
      </div>
    </header>
  )
}
