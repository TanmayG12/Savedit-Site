"use client";

// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/src/components/ui/Container";
import { Pill } from "@/src/components/ui/Pill";
import { CTAButton } from "@/src/components/ui/CTAButton";
import { SectionTitle } from "@/src/components/ui/SectionTitle";
import { Card } from "@/src/components/ui/Card";
import { RotatingBenefits } from "@/src/components/ui/RotatingBenefits";
import { Divider } from "@/src/components/ui/Divider";

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
    "Save from Instagram, TikTok, YouTube, or any app in one tap.",
    "AI auto-tags and sorts your saves into smart collections.",
    "Add notes, thoughts, and reminders that turn ideas into action.",
    "Share saves or full collections with friends and collaborators.",
    "Beautiful cards with auto-thumbnails, titles, and platforms.",
    "Blazing-fast search that understands what you mean.",
    "Private by design — export or delete your data anytime.",
    "Fast, elegant, and built to respect your time.",
  ];

  return (
    <section id="home" className="pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
            Save what inspires you.
          </h1>

          <p className="mt-4 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Articles, videos, or reels — all your saves, automatically organized with AI.
          </p>

          {/* Rotating benefit line */}
          <RotatingBenefits lines={benefits} />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CTAButton href="/ios">Get iOS</CTAButton>
            <CTAButton href="/android">
              Get Android
            </CTAButton>
            <Pill>Public Beta Now Live</Pill>
          </div>
        </div>

        {/* Phone screenshot with shadow and elevation */}
        <div className="relative">
          <Image
            src="/Screenshots/1.png"
            alt="SavedIt app interface showing saved items"
            width={1080}
            height={2336}
            className="mx-auto h-auto w-full max-w-[360px]"
            priority
          />
          {/* soft glow under phone */}
          <div className="pointer-events-none absolute left-1/2 top-full -z-10 mt-6 h-12 w-[65%] -translate-x-1/2 rounded-full bg-neutral-900/10 blur-2xl dark:bg-white/10" />
        </div>
      </Container>
    </section>
  );
}

function Today() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cards = [
    {
      title: "Save from anywhere",
      description: "Use the share sheet to save from Instagram, TikTok, YouTube, or any browser — all in one tap.",
      image: "/Screenshots/2.png",
      alt: "Share to SavedIt",
      imageClass: "rounded-2xl object-cover",
    },
    {
      title: "Smart collections. Zero effort.",
      description: "AI organizes your saves into collections like trips, recipes, or workouts — everything finds its place automatically.",
      image: "/Screenshots/3.png",
      alt: "Collections with AI organization",
      imageClass: "rounded-2xl object-cover object-top",
    },
    {
      title: "Add your thoughts",
      description: 'Attach notes, tags, or reminders to your saves — capture the "why" behind what you saved.',
      image: "/Screenshots/5.png",
      alt: "Add notes and tags",
      imageClass: "rounded-2xl object-cover",
    },
    {
      title: "Share effortlessly",
      description: "Share individual saves or full collections — with simple view or edit permissions you control.",
      image: "/Screenshots/4.png",
      alt: "Share collections",
      imageClass: "rounded-2xl object-cover",
    },
    {
      title: "Set reminders",
      description: "Choose when to revisit or act on what you saved — because inspiration deserves follow-through.",
      image: "/Screenshots/6.png",
      alt: "Set reminders",
      imageClass: "rounded-2xl object-cover object-top",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="what"
      className="scroll-mt-[88px] relative"
      style={{ height: `${cards.length * 100}vh` }}
    >
      <div className="sticky top-8 sm:top-12 md:top-16 h-screen flex flex-col overflow-hidden">
        <Container className="w-full h-full flex flex-col">
          <div className="pt-4 sm:pt-6 md:pt-8 lg:pt-10 mb-12 sm:mb-4 md:mb-4 lg:mb-6">
            <SectionTitle
              eyebrow="Today"
              title="What you can do today"
              kicker="Save what you love, let AI organize it, and come back when you're ready to use it."
            />
          </div>
          <div className="relative h-[42vh] sm:h-[48vh] md:h-[53vh] lg:h-[58vh] w-full pb-2 sm:pb-4 md:pb-6 lg:pb-8">
            {cards.map((card, index) => (
              <StickyCard
                key={index}
                card={card}
                index={index}
                totalCards={cards.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function StickyCard({
  card,
  index,
  totalCards,
  scrollYProgress,
}: {
  card: {
    title: string;
    description: string;
    image: string;
    alt: string;
    imageClass: string;
  };
  index: number;
  totalCards: number;
  scrollYProgress: any;
}) {
  const cardScrollStart = index / totalCards;
  const cardScrollEnd = (index + 1) / totalCards;
  const fadeInPoint = cardScrollStart;
  const stayPointStart = cardScrollStart + 0.08;
  const stayPointEnd = cardScrollEnd - 0.08;
  const fadeOutPoint = cardScrollEnd;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInPoint, stayPointStart, stayPointEnd, fadeOutPoint],
    [0, 1, 1, 0],
    { clamp: true }
  );

  const x = useTransform(
    scrollYProgress,
    [fadeInPoint, stayPointStart, stayPointEnd, fadeOutPoint],
    ["100%", "0%", "0%", "-100%"],
    { clamp: true }
  );

  return (
    <motion.div
      style={{ opacity, x }}
      className="absolute inset-x-0 top-0 bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 flex items-center justify-center"
    >
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-0 w-full max-w-[620px] sm:max-w-[725px] lg:max-w-[830px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
        <div className="flex-1 flex flex-col justify-center space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-medium text-neutral-900 dark:text-neutral-100">{card.title}</h3>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">{card.description}</p>
        </div>
        <div className="w-full sm:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-[174px] sm:max-w-[203px] lg:max-w-[232px] aspect-[9/19]">
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 640px) 174px, (max-width: 1024px) 203px, 232px"
              className={card.imageClass}
              unoptimized
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Vision() {
  return (
    <section id="vision" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Next"
          title="What we&apos;re building next"
          kicker="We're building an Intent OS — a layer that helps you act on every save."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Places → Plans" desc="Turn a saved café or restaurant into a visit with reminders and map pins." />
          <Card title="Videos → Routines" desc="Turn a tutorial into a checklist or learning flow." />
          <Card title="Products → Wishlist+" desc="Track prices, restocks, and group polls." />
          <Card title="Trips → Itineraries" desc="Build shared plans with maps, comments, and collaboration tools." />
        </div>
        <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
          Your saves already carry intention — we&apos;re building the tools that help you follow through.
        </p>
      </Container>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Image
              src="/Screenshots/7.png"
              alt="Privacy and data control features"
              width={1080}
              height={2336}
              className="mx-auto h-auto w-full max-w-[360px]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Your data. Your choice.
            </h2>
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
              Private by default. Minimal by design. Fully under your control.
            </p>
            <div className="mt-6 space-y-4 text-neutral-600 dark:text-neutral-400">
              <p>
                SavedIt only stores what&apos;s essential — your saves and account info.
              </p>
              <p>
                We don&apos;t sell data, we don&apos;t track you, and no one — not even us — looks at your saves.
              </p>
              <p>
                You can export everything or permanently delete your account anytime, right from Settings.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-[88px] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Why SavedIt exists
            </h2>
            <div className="mt-6 space-y-4 text-neutral-600 dark:text-neutral-400">
              <p>
                Every app has a save button. Your memory ends up scattered in a dozen places. SavedIt brings all your
                saves together so you can actually find them later.
              </p>
              <p>
                Started by <strong>Tanmay</strong>, built to be fast, robust, and respectful of your privacy. Works
                offline or online, authenticated or not — because reliability shouldn&apos;t be a feature you pay extra for.
              </p>
            </div>
          </div>
          <Image
            src="/Screenshots/Features/whysaveditexists.png"
            alt="Why SavedIt exists - showing scattered saves vs organized saves"
            width={1080}
            height={2336}
            className="mx-auto h-auto w-full max-w-[360px]"
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
              <CTAButton href="/android">
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