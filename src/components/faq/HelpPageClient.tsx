"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FAQItem } from "@/app/help/faqData";
import HelpHero from "./HelpHero";
import FAQ from "./FAQ";
import { trackEvent } from "@/lib/analytics";

const SEARCH_DEBOUNCE_MS = 160;

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(handle);
    };
  }, [value, delay]);

  return debouncedValue;
}

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export type HelpPageClientProps = {
  items: FAQItem[];
  initialQuery?: string;
  initiallyExpandedId?: string | null;
};

export default function HelpPageClient({ items, initialQuery = "", initiallyExpandedId }: HelpPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(initialQuery);
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    initiallyExpandedId ? [initiallyExpandedId] : [],
  );
  const debouncedQuery = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const latestTrackedQuery = useRef<string | null>(null);

  useEffect(() => {
    if (!initiallyExpandedId) {
      return;
    }
    setExpandedIds((prev) => (prev.includes(initiallyExpandedId) ? prev : [...prev, initiallyExpandedId]));
    const element = document.getElementById(`faq-${initiallyExpandedId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initiallyExpandedId]);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith("faq-")) {
        const id = hash.replace("faq-", "");
        setExpandedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        const element = document.getElementById(`faq-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const query = useMemo(() => normalizeQuery(debouncedQuery), [debouncedQuery]);

  const filteredItems = useMemo(() => {
    if (query.length < 2) {
      return items;
    }
    return items.filter((item) => {
      const haystack = [item.question, item.answer, ...(item.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [items, query]);

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const isOpen = prev.includes(id);
        const next = isOpen ? prev.filter((itemId) => itemId !== id) : [...prev, id];
        if (!isOpen) {
          trackEvent("help_faq_open", { id, section: items.find((item) => item.id === id)?.section });
        }
        return next;
      });
      if (typeof window !== "undefined") {
        const newHash = `#faq-${id}`;
        if (window.location.hash !== newHash) {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}${newHash}`);
        }
      }
    },
    [items],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const currentParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (debouncedQuery && normalizeQuery(debouncedQuery).length >= 2) {
      currentParams.set("q", debouncedQuery);
    } else {
      currentParams.delete("q");
    }
    const queryString = currentParams.toString();
    if (queryString === (searchParams?.toString() ?? "")) {
      return;
    }
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`, { scroll: false });
  }, [debouncedQuery, pathname, router, searchParams]);

  useEffect(() => {
    const normalized = normalizeQuery(debouncedQuery);
    if (latestTrackedQuery.current === normalized) {
      return;
    }
    latestTrackedQuery.current = normalized;
    trackEvent("help_search", { query_length: normalized.length, ts: Date.now() });
  }, [debouncedQuery]);

  const onInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const resultsCount = filteredItems.length;

  return (
    <div className="pb-24">
      <HelpHero inputValue={inputValue} onInputChange={onInputChange} resultsCount={resultsCount} />
      {resultsCount > 0 ? (
        <FAQ items={filteredItems} expandedIds={expandedIds} onToggle={handleToggle} />
      ) : (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-dashed border-emerald-400/60 bg-emerald-500/5 p-10 text-center dark:border-emerald-300/50 dark:bg-emerald-400/10">
            <h2 className="text-xl font-semibold text-text-light dark:text-white">No results for “{debouncedQuery}”.</h2>
            <p className="mt-3 text-base text-text-dim dark:text-text-dark/80">
              Try a different keyword or email us at {" "}
              <a
                className="font-medium text-emerald-600 underline decoration-emerald-300/70 underline-offset-4 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                href="mailto:contact.savedit@gmail.com"
              >
                contact.savedit@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      )}
      <aside className="mx-auto mt-16 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-left shadow-soft dark:border-emerald-300/30 dark:bg-emerald-400/10 dark:shadow-softdark">
          <div>
            <h2 className="text-lg font-semibold text-text-light dark:text-white">Still stuck?</h2>
            <p className="mt-2 text-base text-text-dim dark:text-text-dark/80">
              Email our support team and we’ll help you get back to saving smarter.
            </p>
          </div>
          <a
            href="mailto:contact.savedit@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-text-light px-5 py-2 text-sm font-semibold text-white transition hover:bg-text-light/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-white/90 dark:text-text-light"
          >
            Contact support
            <span aria-hidden className="text-lg leading-none">→</span>
          </a>
        </div>
      </aside>
    </div>
  );
}