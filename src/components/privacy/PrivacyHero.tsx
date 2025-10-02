"use client";

export default function PrivacyHero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-3xl border border-line/60 bg-white/70 p-8 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-softdark">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">
            Legal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-light dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="max-w-2xl text-base text-text-dim dark:text-text-dark/80">
            SavedIt respects your privacy and is committed to protecting your data. This policy explains, in plain language, what information we collect, how we use it, and the choices you have.
          </p>
          <p className="text-sm text-text-dim dark:text-text-dark/70">
            Last updated: September 2025
          </p>
        </div>
      </div>
    </section>
  );
}