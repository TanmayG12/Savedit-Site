import type { Metadata } from "next";

const fallbackSiteUrl = "https://savedit.app";
const siteName = "SavedIt";
const baseTagline = "Save once. Find forever.";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl;
const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

export const absoluteUrl = (path = ""): string => {
  if (!path) {
    return normalizedSiteUrl;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const prefixed = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedSiteUrl}${prefixed}`;
};

const defaultTitle = `${siteName} — ${baseTagline}`;
const titleTemplate = "%s — SavedIt";
export const siteDescription =
  "SavedIt gathers your saved reels, links, and ideas, enriches them with smart metadata, and turns them into beautifully organized, actionable cards.";

const keywords = [
  "SavedIt",
  "save links",
  "bookmark manager",
  "organize saved posts",
  "reading list app",
  "link collections",
  "personal knowledge base",
  "productivity",
  "offline saves",
];

const ogImage = absoluteUrl("/api/og");

export const baseMetadata: Metadata = {
  metadataBase: new URL(normalizedSiteUrl),
  title: {
    default: defaultTitle,
    template: titleTemplate,
  },
  description: siteDescription,
  keywords,
  applicationName: siteName,
  category: "Productivity",
  creator: siteName,
  publisher: siteName,
  authors: [{ name: "SavedIt Team" }],
  alternates: {
    canonical: normalizedSiteUrl,
  },
  openGraph: {
    type: "website",
    url: normalizedSiteUrl,
    title: defaultTitle,
    description: siteDescription,
    siteName,
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "SavedIt hero preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/adaptive-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  themeColor: "#ffffff",
};

export type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
};

export const createPageMetadata = ({
  title,
  description,
  path,
  image,
}: PageMetadataOptions): Metadata => {
  const pageDescription = description ?? siteDescription;
  const canonicalUrl = path ? absoluteUrl(path) : normalizedSiteUrl;
  const socialImage = image ? absoluteUrl(image) : ogImage;

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName,
      title,
      description: pageDescription,
      url: canonicalUrl,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "SavedIt hero preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      images: [socialImage],
    },
  } satisfies Metadata;
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteName,
  url: normalizedSiteUrl,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "iOS, Android, Web",
  description: siteDescription,
  image: ogImage,
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: normalizedSiteUrl,
    logo: absoluteUrl("/adaptive-icon.png"),
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};
