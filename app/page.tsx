import { Header } from '@/components/Header'
import { ShowcaseRail } from '@/components/ShowcaseRail'
import { HowItWorks } from '@/components/HowItWorks'
import { GetApp } from '@/components/GetApp'
import { HelpCTA } from '@/components/HelpCTA'
import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <div className="relative">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="relative grid-bg">
          <div className="container py-16 md:py-28">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl fade-up">
              Turn saved posts into plans.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-text-dim max-w-2xl fade-up">
              SavedIt gathers your saved reels, links, and ideas, enriches them with smart metadata,
              and turns them into beautifully organized, actionable cards you can use — alone or with friends.
            </p>
            <div className="mt-8 flex gap-3 fade-up">
              <a href="/ios" className="rounded-xl border px-5 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Get iOS</a>
              <a href="/android" className="rounded-xl border px-5 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">Get Android</a>
            </div>
            <div className="mt-12">
              <ShowcaseRail />
            </div>
          </div>
        </section>

        <section id="what" className="container py-16 md:py-24">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">What is SavedIt?</h3>
          <p className="text-text-dim max-w-3xl">
            SavedIt is a cross‑app "memory engine." Save from Instagram, TikTok, YouTube, or the web —
            we centralize it, clean it up, and make it ready to use.
          </p>
        </section>

        <HowItWorks />

        <section id="vision" className="container py-16 md:py-24">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">What we're building</h3>
          <p className="text-text-dim max-w-3xl">
            We're turning saved content into a living, collaborative list for your life — restaurants to try,
            trips to plan, skills to learn — minimal where it should be, powerful where it counts.
          </p>
        </section>

        <GetApp />
        <HelpCTA />
      </main>
      <Footer />
    </div>
  )
}
