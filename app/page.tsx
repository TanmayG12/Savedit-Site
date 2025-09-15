"use client";

// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

// ---- Small UI primitives (kept local to the page for easy copy/paste) ----
function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:text-neutral-300">
      {children}
    </span>
  );
}

function CTAButton({
  href,
  children,
  secondary,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return secondary ? (
    <Link
      className={`${base} border border-neutral-200 text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-900/60`}
      href={href}
    >
      {children}
    </Link>
  ) : (
    <Link
      className={`${base} bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200`}
      href={href}
    >
      {children}
    </Link>
  );
}

function SectionTitle({ eyebrow, title, kicker }: { eyebrow?: string; title: string; kicker?: string }) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <div className="mb-2 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{eyebrow}</div>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{title}</h2>
      {kicker ? (
        <p className="mt-3 max-w-3xl text-neutral-600 dark:text-neutral-400">{kicker}</p>
      ) : null}
    </div>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-[0_2px_30px_rgba(0,0,0,0.05)] backdrop-blur dark:border-neutral-800 dark:bg-black/30">
      {title ? <div className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{title}</div> : null}
      {desc ? <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">{desc}</div> : null}
      {children}
    </div>
  );
}

/* ---------------- Rotating, type-in benefit line (no deps) ---------------- */
function RotatingBenefits({
  lines,
  typeSpeed = 22,      // ms per char
  holdMs = 1200,       // pause when fully typed
  fadeMs = 350,        // fade-out duration
}: {
  lines: string[];
  typeSpeed?: number;
  holdMs?: number;
  fadeMs?: number;
}) {
  const [i, setI] = useState(0);          // which line
  const [typed, setTyped] = useState(""); // visible substring
  const [fading, setFading] = useState(false);
  const [reduced, setReduced] = useState(false);
  const mounted = useRef(false);

  const line = useMemo(() => lines[i % lines.length], [i, lines]);

  useEffect(() => {
    mounted.current = true;
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
      const onChange = () => setReduced(mq.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    } catch {
      // SSR or older browsers: ignore
    }
  }, []);

  useEffect(() => {
    if (reduced) {
      // No typing; simple rotate every 1.6s
      setTyped(line);
      const t = setTimeout(() => setI((v) => (v + 1) % lines.length), 1600);
      return () => clearTimeout(t);
    }

    let t: ReturnType<typeof setTimeout> | undefined;
    if (typed.length < line.length) {
      t = setTimeout(() => setTyped(line.slice(0, typed.length + 1)), typeSpeed);
    } else {
      // fully typed → hold → fade → next
      const hold = setTimeout(() => {
        setFading(true);
        const afterFade = setTimeout(() => {
          setFading(false);
          setTyped("");
          setI((v) => (v + 1) % lines.length);
        }, fadeMs);
        t = afterFade as unknown as ReturnType<typeof setTimeout>;
      }, holdMs);
      t = hold;
    }
    return () => t && clearTimeout(t);
  }, [typed, line, lines.length, typeSpeed, holdMs, fadeMs, reduced]);

  return (
    <div
      aria-live="polite"
      className={`mt-3 flex items-center text-base text-neutral-500 transition-opacity duration-300 dark:text-neutral-400 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <span className="truncate">{typed}</span>
      {/* caret */}
      {!reduced && (
        <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-current" />
      )}
    </div>
  );
}

// ---- Page ----
export default function HomePage() {
  return (
    <main>
      {/* Smooth anchor jump offset handled in globals.css (scroll-margin-top). */}
      <Hero />
      <Divider />
      <Today />
      <Divider subtle />
      <Vision />
      <Divider />
      <Privacy />
      <Divider subtle />
      <About />
      <Divider />
      <FinalCTA />
    </main>
  );
}

// ---- Sections ----
function Hero() {
  const benefits = [
    "Save from any app in two taps.",
    "Auto thumbnails, titles, and sources.",
    "Add tags and notes that you’ll actually find later.",
    "Collections for trips, recipes, workouts, learning.",
    "Blazing-fast search across everything you saved.",
    "Works even without an account.",
    "Offline-first. Your saves don’t disappear.",
    "Private by design. No selling. No snooping.",
    "Import your existing saves easily.",
    "One tap to jump back to the original app.",
    "Instagram and TikTok friendly — share sheet native.",
    "Quick add notes while saving (no extra screens).",
    "Suggested tags that learn how you organize.",
    "Smart dedupe for repeated links.",
    "Create shared collections with friends (coming).",
    "Turn restaurants into plans with reminders (next).",
    "Track product prices from your wishlist (next).",
    "Map view for places you’ve saved (next).",
    "Keyboard-friendly on desktop; buttery on mobile.",
    "Beautiful cards that make your memory feel organized.",
    "Export anytime. Your data is yours.",
    "Fast, reliable, and respectful of your time.",
    "Save once. Find forever.",
  ];

  return (
    <section id="home" className="pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
            One place for all your saves.
          </h1>

          <p className="mt-4 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Save links, reels, and videos from Instagram, TikTok, YouTube—or any app. Turn them into beautiful cards,
            add notes and tags, and keep them together in collections. That’s it: simple, fast, reliable.
          </p>

          {/* Rotating benefit line */}
          <RotatingBenefits lines={benefits} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CTAButton href="/ios">Get iOS</CTAButton>
            <CTAButton href="/android" secondary>
              Get Android
            </CTAButton>
            <Pill>Early access</Pill>
          </div>
        </div>

        {/* Phone screenshot with shadow and elevation */}
        <div className="relative">
          <Image
            src="/Screenshots/Hero/Simulator Screenshot - iPhone 16 Pro - 2025-09-14 at 13.04.48-portrait.png"
            alt="SavedIt app interface showing saved items"
            width={1080}
            height={2336}
            className="mx-auto h-auto w-full max-w-[340px]"
            priority
          />
          {/* floating label */}
          <div className="pointer-events-none absolute -left-6 -top-6 hidden rotate-[-3deg] md:block">
            <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
              Save from any app
            </div>
          </div>
          {/* soft glow under phone */}
          <div className="pointer-events-none absolute left-1/2 top-full -z-10 mt-6 h-12 w-[65%] -translate-x-1/2 rounded-full bg-neutral-900/10 blur-2xl dark:bg-white/10" />
        </div>
      </Container>
    </section>
  );
}

function Today() {
  return (
    <section id="what" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Today"
          title="What you can do right now"
          kicker="SavedIt is your cross-app save box. Save from anywhere, organize with tags and collections, and come back when you need it."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Save from anywhere" desc="Use the system share sheet from Instagram, TikTok, YouTube, or the web.">
            <div className="flex justify-center">
              <Image
                src="/Screenshots/Features/save-interface.png"
                alt="Share to SavedIt"
                width={1200}
                height={900}
                className="h-64 w-auto rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </Card>

          <Card title="Beautiful cards" desc="Auto thumbnails and titles. Add notes. Add tags. Search later.">
            <div className="flex justify-center">
              <Image
                src="/Screenshots/Features/Cards.png"
                alt="Saved card"
                width={1200}
                height={900}
                className="h-64 w-auto rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </Card>

          <Card title="Collections" desc="Group similar saves — restaurants, trips, learning, wishlist — however you think.">
            <div className="flex justify-center">
              <Image
                src="/Screenshots/Features/Collections.png"
                alt="Collections"
                width={1200}
                height={900}
                className="h-64 w-auto rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </Card>

          <Card title="Tags & Notes" desc="Add personal notes and tags to any save. Find exactly what you're looking for later.">
            <div className="flex justify-center">
              <Image
                src="/Screenshots/Features/notesandtags.png"
                alt="Tags and notes interface"
                width={1200}
                height={900}
                className="h-64 w-auto rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function Vision() {
  return (
    <section id="vision" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Next"
          title="Where we’re going"
          kicker="Today: save & revisit. Next: an action layer that helps you do something with what you saved."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card title="Restaurants → Plans" desc="Turn a saved spot into a dinner plan with reminders and map pins." />
          <Card title="How-to reels → Tasks" desc="Schedule cleaning/cooking routines straight from a saved video." />
          <Card title="Products → Watchlist" desc="Track price or availability on items you’ve saved." />
        </div>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          We’re building this with early users. Try SavedIt now and shape what comes next.
        </p>
      </Container>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle title="Your saves are yours" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card title="Minimal data">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We only store the content you save (URL + metadata) and your account info. Nothing more.
            </p>
          </Card>
          <Card title="No selling. No snooping.">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We do not sell data. No one — not even us — looks at your saves.
            </p>
          </Card>
          <Card title="Export & delete">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You can export or delete your data anytime from the app’s settings.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle title="Why SavedIt exists" />
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="text-neutral-600 dark:text-neutral-400">
            <p>
              Every app has a save button. Your memory ends up scattered in a dozen places. SavedIt brings all your
              saves together so you can actually find them later.
            </p>
            <p className="mt-4">
              Started by <strong>Tanmay</strong>, built to be fast, robust, and respectful of your privacy. Works
              offline or online, authenticated or not — because reliability shouldn’t be a feature you pay extra for.
            </p>
          </div>
          <Image
            src="/Screenshots/Features/whysaveditexists.png"
            alt="Why SavedIt exists - showing scattered saves vs organized saves"
            width={1080}
            height={2336}
            className="mx-auto h-auto w-full max-w-[340px]"
          />
        </div>
      </Container>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="get-app" className="scroll-mt-[88px] pb-24 pt-6 sm:pb-28">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-[0_2px_30px_rgba(0,0,0,0.05)] dark:border-neutral-800 dark:bg-black/30 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Try SavedIt — free, early access
              </h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Join now. Save from anywhere. Help us build the action layer next.
              </p>
            </div>
            <div className="flex gap-3 sm:justify-end">
              <CTAButton href="/ios">Get iOS</CTAButton>
              <CTAButton href="/android" secondary>
                Get Android
              </CTAButton>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <div>© {new Date().getFullYear()} SavedIt</div>
          <nav className="flex items-center gap-5">
            <Link className="hover:underline" href="/help">Help</Link>
            <Link className="hover:underline" href="/legal/terms">Terms</Link>
            <Link className="hover:underline" href="/legal/privacy">Privacy</Link>
          </nav>
        </footer>
      </Container>
    </section>
  );
}

function Divider({ subtle }: { subtle?: boolean }) {
  return (
    <div className={subtle ? "h-12 sm:h-14" : "h-16 sm:h-20 lg:h-24"}>
      {/* spacer; opt into subtle/normal rhythm */}
    </div>
  );
}