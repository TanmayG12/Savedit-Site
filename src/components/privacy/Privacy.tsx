"use client";

import { useState } from "react";
import type { PrivacyItemType } from "./PrivacyItem";
import PrivacyItem from "./PrivacyItem";

const PRIVACY_SECTIONS = ["Data Collection", "Your Rights", "Security & Compliance", "Policies"];

const PRIVACY_ITEMS: PrivacyItemType[] = [
  {
    id: "what-we-collect",
    title: "1. What We Collect",
    content: "When you use SavedIt, we may collect:\n• Account details: email address, name (if you provide it).\n• Saved content: links, titles, tags, and metadata you choose to save.\n• Usage data: how you interact with the app (searches, collections created, etc.).\n• Device information: basic logs such as device type, operating system, crash reports (to improve performance).\n\n👉 We do not collect sensitive personal data (like payment info, health info, or contacts).",
    section: "Data Collection",
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Data",
    content: "We use the data we collect to:\n• Provide the SavedIt service (save, organize, and share content).\n• Personalize your experience (e.g., show recent saves first).\n• Improve performance and fix bugs.\n• Keep the app secure and prevent abuse.\n\n👉 We do not sell your data to advertisers or third parties.",
    section: "Data Collection",
  },
  {
    id: "when-we-share",
    title: "3. When We Share Data",
    content: "We only share your data with trusted service providers, such as:\n• Hosting & storage providers (e.g., cloud servers).\n• Analytics tools (to understand how features are used, in aggregate).\n• Support tools (if you email support@savedit.app).\n\n👉 These providers only use your data to provide services to SavedIt.\n\nWe never share your data for marketing purposes without your consent.",
    section: "Data Collection",
  },
  {
    id: "your-rights",
    title: "4. Your Rights",
    content: "You are always in control of your data. You can:\n• Export your data: Download all of your saves.\n• Delete your data: Permanently remove your account and all content.\n• Update your info: Change your email or account details.\n\nTo exercise these rights, use in-app settings or contact support@savedit.app.",
    section: "Your Rights",
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: "• We use encryption in transit (HTTPS) and at rest (database encryption).\n• Access to your data is restricted to authorized systems and staff.\n• No online service is 100% secure, but we take strong measures to protect it.",
    section: "Security & Compliance",
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: "• We keep your data for as long as you have an account.\n• If you delete your account, we delete your data promptly (backups may persist for up to 30 days).",
    section: "Security & Compliance",
  },
  {
    id: "childrens-privacy",
    title: "7. Children's Privacy",
    content: "SavedIt is not designed for children under 13. We do not knowingly collect data from children under 13.",
    section: "Security & Compliance",
  },
  {
    id: "international-users",
    title: "8. International Users",
    content: "Our servers may be located outside your country. By using SavedIt, you agree your data may be transferred and processed where our servers operate.",
    section: "Security & Compliance",
  },
  {
    id: "updates",
    title: "9. Updates to This Policy",
    content: "We may update this Privacy Policy from time to time. If we make significant changes, we'll notify you in the app or by email.",
    section: "Policies",
  },
  {
    id: "contact-us",
    title: "10. Contact Us",
    content: "Questions or concerns? Email us anytime at support@savedit.app.",
    section: "Policies",
  },
];

export default function Privacy() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const isOpen = prev.includes(id);
      return isOpen ? prev.filter((itemId) => itemId !== id) : [...prev, id];
    });
  };

  const grouped = PRIVACY_ITEMS.reduce<Record<string, PrivacyItemType[]>>((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="divide-y divide-line/60 overflow-hidden rounded-3xl border border-line/60 bg-white/80 shadow-soft dark:divide-white/10 dark:border-white/10 dark:bg-white/5 dark:shadow-softdark">
        {PRIVACY_SECTIONS.map((section) => {
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
                  <PrivacyItem
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