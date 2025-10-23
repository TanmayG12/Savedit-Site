"use client";

import { useState } from "react";
import type { PrivacyItemType } from "./PrivacyItem";
import PrivacyItem from "./PrivacyItem";

const PRIVACY_SECTIONS = ["Information We Collect", "Google Sign-In & API Data", "Other Information", "Data Sharing", "Your Rights & Deletion", "Security"];

const PRIVACY_ITEMS: PrivacyItemType[] = [
  {
    id: "info-you-provide",
    title: "Information You Provide",
    content: "When you create an account or interact with SavedIt, we collect:\n• Your name, email address, and profile photo (if signing in via Google).\n• Any additional details you choose to add to your profile (e.g., username, interests, collections, or reminders).\n\n👉 We do not collect sensitive personal data (e.g., financial, biometric, or government identification information).",
    section: "Information We Collect",
  },
  {
    id: "google-oauth-scopes",
    title: "What Google Scopes We Request",
    content: "When you sign in with Google, SavedIt requests the following OAuth scopes with your consent:\n• openid (ID token)\n• email (email address)\n• profile (name and profile image)\n\nWe also request offline access to obtain a refresh token for continued authentication when you reopen the app.",
    section: "Google Sign-In & API Data",
  },
  {
    id: "google-userinfo",
    title: "What We Collect from Google",
    content: "Through Google's userinfo service, we obtain:\n• Unique Google identifier (sub)\n• Name and display name\n• Email address\n• Profile image URL\n\n👉 We do not access or store restricted Google data (such as Gmail, Drive, or Calendar) without explicit user consent.",
    section: "Google Sign-In & API Data",
  },
  {
    id: "google-data-use",
    title: "How We Use Google Data",
    content: "• To authenticate you and create your SavedIt account.\n• To show your name and profile picture inside the app.\n• To send essential account-related notifications (e.g., sign-in confirmations or account deletion alerts).\n• To improve user experience and maintain security.\n\n👉 We do not use Google data for ads, tracking, or resale.",
    section: "Google Sign-In & API Data",
  },
  {
    id: "data-storage-protection",
    title: "How We Store and Protect Data",
    content: "• We store your name, email, and profile image URL in our Supabase database.\n• We do NOT store Google access or refresh tokens. Instead, these are exchanged server-side for a Supabase session.\n• Authentication sessions are persisted by the Supabase client using secure app storage.\n• On iOS, we use the system Keychain (with an App Group) for secure access between the main app and Share Extension.\n• In development mode (Expo Go), secure fallback storage is used.\n• All communication with Google and Supabase is encrypted in transit (TLS) and at rest.",
    section: "Google Sign-In & API Data",
  },
  {
    id: "automatic-data",
    title: "Automatically Collected Data",
    content: "When you use the app, we may collect non-identifiable data such as:\n• Device type and OS version\n• App performance metrics and crash reports\n\n👉 This information helps us debug and improve SavedIt. We do not use cookies or analytics tracking for advertising.",
    section: "Other Information",
  },
  {
    id: "third-party-services",
    title: "Third-Party Service Providers",
    content: "We work with trusted providers to operate SavedIt:\n• Supabase (database, authentication, storage)\n• Vercel (web hosting and serverless infrastructure)\n\n👉 These partners are bound by confidentiality and process data only to support SavedIt's functionality.",
    section: "Data Sharing",
  },
  {
    id: "data-sharing-policy",
    title: "Data Sharing Policy",
    content: "• We do not sell or rent your personal data.\n• During sign-in, our server calls Google's userinfo endpoint solely to verify your identity and fetch basic profile information.\n• We only share limited data with verified subprocessors under data-processing agreements.",
    section: "Data Sharing",
  },
  {
    id: "retention-deletion",
    title: "Data Retention & Deletion",
    content: "• We retain your Google-derived account data while your SavedIt account is active.\n• You can delete your account at any time via the app's Settings.\n• Once deleted, all associated data (including Google-linked identifiers) is permanently removed within 30 days.\n• Currently, SavedIt does not support unlinking a Google account without deleting the SavedIt account.\n\n👉 Exceptions: Data may be retained where required by law or for security/anti-abuse reasons.",
    section: "Your Rights & Deletion",
  },
  {
    id: "user-rights",
    title: "Your Rights",
    content: "You have the right to:\n• Access and correct your personal data\n• Request deletion of your account and all data\n• Withdraw your consent for Google Sign-In at any time via https://myaccount.google.com/permissions",
    section: "Your Rights & Deletion",
  },
  {
    id: "security-measures",
    title: "Security Measures",
    content: "• We implement industry-standard encryption for all data in transit and at rest.\n• Access to your data is restricted to authorized systems and staff.\n• We audit our systems regularly to detect unauthorized access or disclosure.\n\n👉 No online service is 100% secure, but we use strong measures to protect your information.",
    section: "Security",
  },
  {
    id: "contact-privacy",
    title: "Contact Us",
    content: "If you have any questions about this Privacy Policy or how we handle Google user data, please contact us at:\n📧 contact.savedit@gmail.com",
    section: "Security",
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