"use client";

import { useState } from "react";
import type { TermsItemType } from "./TermsItem";
import TermsItem from "./TermsItem";

const TERMS_SECTIONS = ["General", "Your Rights", "Usage", "Policies"];

const TERMS_ITEMS: TermsItemType[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: "SavedIt is a Canadian project designed to help you save and organize links, posts, and ideas from other apps. By using SavedIt, you agree to these terms.",
    section: "General",
  },
  {
    id: "eligibility",
    title: "2. Eligibility & Accounts",
    content: "You must be at least 13 years old to use SavedIt. You are responsible for your account, device, and password. You can delete or deactivate your account anytime.",
    section: "General",
  },
  {
    id: "content-rights",
    title: "3. Your Content & Rights",
    content: "You own the rights to the content you save. SavedIt only stores and displays it to make the app work. Please don't upload anything illegal, harmful, or copyrighted without permission.",
    section: "Your Rights",
  },
  {
    id: "how-works",
    title: "4. How SavedIt Works",
    content: "SavedIt lets you save links from other apps, organize them into collections, and share them with friends. However, we don't guarantee the availability of third-party content.",
    section: "Usage",
  },
  {
    id: "prohibited-use",
    title: "5. Prohibited Use",
    content: "Don't misuse the app by uploading illegal content, spamming, harassing others, or reverse-engineering the service.",
    section: "Usage",
  },
  {
    id: "privacy-data",
    title: "6. Privacy & Data",
    content: "SavedIt respects your privacy. You can export or delete your data anytime. For more details, refer to our Privacy Policy.",
    section: "Policies",
  },
  {
    id: "availability",
    title: "7. App Availability & Limitations",
    content: "SavedIt is provided 'as is.' We don't guarantee uptime or liability for lost data. Features may be updated, discontinued, or limited.",
    section: "Policies",
  },
  {
    id: "changes",
    title: "8. Changes to Terms",
    content: "We may update these terms with notice. Continued use of SavedIt means you accept the updated terms.",
    section: "Policies",
  },
];

export default function Terms() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const isOpen = prev.includes(id);
      return isOpen ? prev.filter((itemId) => itemId !== id) : [...prev, id];
    });
  };

  const grouped = TERMS_ITEMS.reduce<Record<string, TermsItemType[]>>((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="divide-y divide-line/60 overflow-hidden rounded-3xl border border-line/60 bg-white/80 shadow-soft dark:divide-white/10 dark:border-white/10 dark:bg-white/5 dark:shadow-softdark">
        {TERMS_SECTIONS.map((section) => {
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
                  <TermsItem
                    key={item.id}
                    item={item}
                    isOpen={expandedIds.includes(item.id)}
                    onToggle={handleToggle}
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