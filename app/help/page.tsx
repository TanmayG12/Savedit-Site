import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import HelpPageClient from "@/components/faq/HelpPageClient";
import { FAQ_ITEMS } from "./faqData";

export const metadata: Metadata = createPageMetadata({
  title: "Help & FAQs",
  description:
    "Get quick answers about creating collections, saving links, and contacting the SavedIt team for support.",
  path: "/help",
});

export default function HelpPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialQueryRaw = searchParams?.q;
  const initialQuery = Array.isArray(initialQueryRaw) ? initialQueryRaw[0] ?? "" : initialQueryRaw ?? "";

  return <HelpPageClient items={FAQ_ITEMS} initialQuery={initialQuery} initiallyExpandedId={null} />;
}
