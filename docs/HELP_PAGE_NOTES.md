# Help Page Notes

## Content source of truth
- FAQ entries live in [`app/help/faqData.ts`](../app/help/faqData.ts). Marketing can edit the array without touching any JSX.
- Each entry must include an `id`, `section`, `question`, `answer`, and optional `keywords` for search relevance.

## Editing or adding FAQs
1. Duplicate an existing object in `FAQ_ITEMS` and adjust the text.
2. Ensure the `id` stays unique and URL friendly (used for hash links like `#faq-what-is-savedit`).
3. Pick one of the supported sections defined in `FAQItem["section"]`.
4. Optionally extend `keywords` with short strings to improve search results.

When new sections are required, update both `FAQ_SECTIONS` and the derived `FAQ_BY_SECTION` map so the UI renders in the right order.

## Search behavior
- The search input filters FAQs on the client after a 160ms debounce.
- Queries shorter than two characters keep all FAQs visible to encourage exploration.
- Matching looks at the question, answer, and any `keywords` values.
- When no matches are found, a highlighted state invites the visitor to email support.
- Search terms are synced to the URL (`?q=...`) so deep links retain context.

## Linking to a specific question
- Each question renders with an anchor ID following `faq-{id}`.
- Linking directly to `/help#faq-export-data` opens the accordion automatically and scrolls it into view.
- Hash changes continue to work thanks to a listener that expands and focuses the relevant item.

## Analytics
- Opening a question emits `help_faq_open` with the FAQ `id` and `section`.
- Search updates emit `help_search` with the normalized query length and a timestamp.
- Events currently pass through a no-op helper in [`lib/analytics.ts`](../lib/analytics.ts); connect this to Vercel Analytics or PostHog when ready.

## Follow-ups / TODOs
- Replace the analytics no-op with the production tracking client once available.
- If SavedIt gains additional sections, consider promoting them to dedicated components for layout reuse.
