import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import PrivacyHero from "@/src/components/privacy/PrivacyHero";
import Privacy from "@/src/components/privacy/Privacy";
import { Footer } from "@/src/components/Footer";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Understand how SavedIt handles account details, saved content, and data deletion requests with a privacy-first approach.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <main className="pb-24">
        <PrivacyHero />
        <Privacy />
      </main>
      <Footer />
    </>
  );
}
