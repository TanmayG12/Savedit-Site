import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { baseMetadata } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = baseMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
