export function HowItWorks() {
  const steps = [
    { title: 'Save', desc: 'Share to SavedIt from Instagram, TikTok, YouTube, or the web.' },
    { title: 'Auto‑enrich', desc: 'We fetch thumbnails, creators, titles, and smart tags.' },
    { title: 'Act & share', desc: 'Plan outings, add notes, pin to maps, or share with friends.' },
  ]
  return (
    <section id="how" className="container py-16 md:py-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-8">How SavedIt works</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.title} className="rounded-2xl border p-6 hover:shadow-soft dark:hover:shadow-softdark transition">
            <div className="text-sm text-text-dim mb-2">{s.title}</div>
            <div className="text-base leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
