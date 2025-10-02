import Link from 'next/link'
export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="container py-8 text-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="text-text-dim">© {new Date().getFullYear()} SavedIt</div>
        <nav className="flex gap-6">
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/legal/terms" className="hover:underline">Terms</Link>
          <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}
