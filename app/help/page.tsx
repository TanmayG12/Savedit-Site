import HelpPageClient from "@/components/faq/HelpPageClient";
import { FAQ_ITEMS } from "./faqData";

export default function HelpPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const initialQueryRaw = searchParams?.q;
  const initialQuery = Array.isArray(initialQueryRaw) ? initialQueryRaw[0] ?? "" : initialQueryRaw ?? "";

  return <HelpPageClient items={FAQ_ITEMS} initialQuery={initialQuery} initiallyExpandedId={null} />;
}
