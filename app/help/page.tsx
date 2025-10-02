import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Help & FAQs",
  description:
    "Get quick answers about creating collections, saving links, and contacting the SavedIt team for support.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 prose dark:prose-invert">
      <h1>Help &amp; FAQs</h1>
      <p>
        <strong>SavedIt</strong> lets you save links from any app and organize them into collections.
      </p>
      <h2>Common actions</h2>
      <ul>
        <li>
          <strong>Create a collection:</strong> In the app, tap <em>New Collection</em>.
        </li>
        <li>
          <strong>Share to SavedIt:</strong> Use the system <em>Share</em> sheet and pick <em>SavedIt</em>.
        </li>
        <li>
          <strong>Find it later:</strong> Search by title, tag, or source app.
        </li>
      </ul>
      <hr />
      <h3>Contact</h3>
      <p>
        Support: <a href="mailto:support@savedit.app">support@savedit.app</a>
      </p>
    </main>
  );
}
