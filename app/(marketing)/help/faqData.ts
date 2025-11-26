export type FAQItem = {
  id: string;
  section:
    | "Getting Started"
    | "Saving Content"
    | "Finding & Using Saves"
    | "Account & Data"
    | "Contact";
  question: string;
  answer: string;
  keywords?: string[];
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-is-savedit",
    section: "Getting Started",
    question: "What is SavedIt?",
    answer:
      "SavedIt helps you save posts, articles, and links from any app and keep them organized in one place.",
    keywords: ["overview", "about", "how it works"],
  },
  {
    id: "create-first-collection",
    section: "Getting Started",
    question: "How do I create my first collection?",
    answer:
      "Tap New Collection in the app, give it a name (for example, Restaurants or Travel), and you're set.",
    keywords: ["collections", "new", "setup"],
  },
  {
    id: "save-to-savedit",
    section: "Saving Content",
    question: "How do I save something to SavedIt?",
    answer:
      "In the app where you found the link, tap Share, choose SavedIt, and pick a collection.",
    keywords: ["share sheet", "save link", "add"],
  },
  {
    id: "add-tags",
    section: "Saving Content",
    question: "Can I add tags?",
    answer: "Yes. Add tags while saving or later when editing a saved item.",
    keywords: ["metadata", "labels", "organize"],
  },
  {
    id: "find-saved-item",
    section: "Finding & Using Saves",
    question: "How do I find something I saved?",
    answer:
      "Use Search to look up by title, tag, or the app you saved it from.",
    keywords: ["search", "filter", "discover"],
  },
  {
    id: "share-with-friends",
    section: "Finding & Using Saves",
    question: "Can I share saves with friends?",
    answer:
      "Yes — individual saves can be shared by sharing their direct links from the app. Collection sharing is still on the roadmap.",
    keywords: ["collaboration", "friends", "share"],
  },
  {
    id: "export-data",
    section: "Account & Data",
    question: "Can I export my saved data?",
    answer: "Yes — go to Profile → Export Data to download your saves.",
    keywords: ["download", "backup", "export"],
  },
  {
    id: "delete-account",
    section: "Account & Data",
    question: "How do I delete my account?",
    answer:
      "In Profile → Settings, choose Delete Account. You can pick soft delete (pause) or full delete.",
    keywords: ["remove", "privacy", "account"],
  },
  {
    id: "contact-support",
    section: "Contact",
    question: "Need more help?",
    answer: "Email contact.savedit@gmail.com — we typically reply within 1–2 business days.",
    keywords: ["support", "email", "help"],
  },
  {
    id: "add-to-share-sheet-ios",
    section: "Saving Content",
    question: "How do I add SavedIt to the iOS Share Sheet?",
    answer:
      "After installing SavedIt, open the Share Sheet in any app, scroll to the end of the apps list, tap 'More', and enable SavedIt from the list.",
    keywords: ["iOS", "share sheet", "enable"],
  },
  {
    id: "add-to-share-sheet-android",
    section: "Saving Content",
    question: "How do I add SavedIt to the Android Share Sheet?",
    answer:
      "SavedIt is automatically added to the Android Share Sheet after installation. If you don't see it, try restarting your device.",
    keywords: ["Android", "share sheet", "enable"],
  },
  {
    id: "favorite-share-sheet-ios",
    section: "Saving Content",
    question: "How do I favorite SavedIt in the iOS Share Sheet?",
    answer:
      "Open the Share Sheet in any app, scroll to the end of the apps list, tap 'Edit', and drag SavedIt to the Favorites section.",
    keywords: ["iOS", "share sheet", "favorite"],
  },
  {
    id: "favorite-share-sheet-android",
    section: "Saving Content",
    question: "How do I favorite SavedIt in the Android Share Sheet?",
    answer:
      "In the Android Share Sheet, long-press SavedIt and select 'Pin' to add it to the top of the list.",
    keywords: ["Android", "share sheet", "favorite"],
  },
];

export const FAQ_SECTIONS: FAQItem["section"][] = [
  "Getting Started",
  "Saving Content",
  "Finding & Using Saves",
  "Account & Data",
  "Contact",
];

export const FAQ_BY_SECTION: Record<FAQItem["section"], FAQItem[]> = FAQ_SECTIONS.reduce(
  (acc, section) => {
    acc[section] = FAQ_ITEMS.filter((item) => item.section === section);
    return acc;
  },
  {
    "Getting Started": [],
    "Saving Content": [],
    "Finding & Using Saves": [],
    "Account & Data": [],
    Contact: [],
  } as Record<FAQItem["section"], FAQItem[]>,
);