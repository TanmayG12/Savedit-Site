import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import TermsHero from "@/src/components/terms/TermsHero";
import Terms from "@/src/components/terms/Terms";
import { Footer } from "@/src/components/Footer";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Review the SavedIt terms of service covering user responsibilities, content ownership, and future updates to the platform.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <>
      <main className="pb-24">
        <TermsHero />
        <Terms />
      </main>
      <Footer />
    </>
  );
}
