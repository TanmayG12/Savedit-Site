'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8 rounded-xl border" />
  const isDark = (theme ?? resolvedTheme) === 'dark'
  return (
    <button
      className="h-8 w-8 rounded-xl border flex items-center justify-center hover:shadow-soft dark:hover:shadow-softdark transition"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
