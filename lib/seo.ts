import type { Metadata } from 'next'

const title = 'SavedIt — Turn saved posts into plans'
const description = 'SavedIt gathers your saved reels, links, and ideas, enriches them with smart metadata, and turns them into beautifully organized, actionable cards.'
const url = 'https://savedit.app'

export const baseMetadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'SavedIt' }]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/api/og']
  },
  icons: { icon: '/favicon.svg' }
}
