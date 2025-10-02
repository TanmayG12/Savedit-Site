import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Understand how SavedIt handles account details, saved content, and data deletion requests with a privacy-first approach.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        We collect minimal data to run SavedIt (account + saved links). We do not sell your data. You can request deletion at any
        time.
      </p>
      <h2>What we store</h2>
      <ul>
        <li>Account info (email, name)</li>
        <li>Saved items (URL + metadata)</li>
        <li>Basic analytics to improve features</li>
      </ul>
      <h2>Your choices</h2>
      <ul>
        <li>Export or delete your data from <em>Settings</em> in the app.</li>
        <li>
          Contact <a href="mailto:privacy@savedit.app">privacy@savedit.app</a> for requests.
        </li>
      </ul>
      <p>
        <small>Last updated: September 2025</small>
      </p>
    </main>
  );
}
