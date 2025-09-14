import Link from 'next/link'
export function GetApp() {
  return (
    <section id="get" className="container py-16 md:py-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6">Get the app</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-text-dim">iOS (TestFlight)</div>
            <div className="text-lg mt-1">Try SavedIt on iPhone</div>
          </div>
          <Link href="/ios" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Get iOS</Link>
        </div>
        <div className="rounded-2xl border p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-text-dim">Android (APK)</div>
            <div className="text-lg mt-1">Download the APK</div>
          </div>
          <Link href="/android" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Get Android</Link>
        </div>
      </div>
    </section>
  )
}
