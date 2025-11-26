"use client";

import { useMemo } from "react";
import type { FAQItem as FAQItemType } from "@/app/(marketing)/help/faqData";
import FAQItem from "./FAQItem";
import { FAQ_SECTIONS } from "@/app/(marketing)/help/faqData";

export type FAQProps = {
  items: FAQItemType[];
  expandedIds: string[];
  onToggle: (id: string) => void;
};

export default function FAQ({ items, expandedIds, onToggle }: FAQProps) {
  const grouped = useMemo(() => {
    return items.reduce<Record<string, FAQItemType[]>>((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="divide-y divide-line/60 overflow-hidden rounded-3xl border border-line/60 bg-white/80 shadow-soft dark:divide-white/10 dark:border-white/10 dark:bg-white/5 dark:shadow-softdark">
        {FAQ_SECTIONS.map((section) => {
          const sectionItems = grouped[section] ?? [];
          if (sectionItems.length === 0) {
            return null;
          }

          return (
            <section key={section} className="px-6 py-6 sm:px-8">
              <header className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight text-text-light dark:text-white">{section}</h2>
                <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-600 dark:border-emerald-300/40 dark:text-emerald-300">
                  {sectionItems.length}
                </span>
              </header>
              <div>
                {sectionItems.map((item) => (
                  <FAQItem
                    key={item.id}
                    item={item}
                    isOpen={expandedIds.includes(item.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}