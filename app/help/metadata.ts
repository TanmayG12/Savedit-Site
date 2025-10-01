import type { Metadata } from "next";
import { isProduction } from "@/lib/env";

const title = "Help & FAQs — SavedIt";
const description = "How to save, organize, and find your content with SavedIt. Tips, FAQs, and support.";
const canonicalUrl = "https://savedit.app/help";

const metadata: Metadata = {
  metadataBase: new URL("https://savedit.app"),
  title,
  description,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "SavedIt" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/api/og"],
  },
  robots: isProduction()
    ? undefined
    : {
        index: false,
        follow: false,
      },
};

export default metadata;
