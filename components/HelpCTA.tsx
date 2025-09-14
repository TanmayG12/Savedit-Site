import Link from 'next/link'
export function HelpCTA() {
  return (
    <section id="help" className="container py-16 md:py-24">
      <div className="rounded-2xl border p-8 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-semibold">Need help?</h4>
          <p className="text-text-dim mt-1">Read the Help & FAQ or contact us.</p>
        </div>
        <Link href="/help" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Open Help</Link>
      </div>
    </section>
  )
}
