# SavedIt — Marketing Site (Next.js 14, grayscale)

Black & white only, elegant marketing site with dark/light themes, product mocks, Help & Legal, and TestFlight/APK redirect routes.

## Quick start
```bash
pnpm i
pnpm dev
```

## Environment variables
Set these in Vercel (Project → Settings → Environment Variables) or a local `.env`:
```env
NEXT_PUBLIC_TESTFLIGHT_URL=https://testflight.apple.com/join/XXXX
NEXT_PUBLIC_ANDROID_APK_URL=https://example.com/savedit.apk
```

## Deploy (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

## Structure
- `/` landing
- `/help` MDX
- `/legal/terms`, `/legal/privacy` MDX
- `/ios` → 302 to TestFlight
- `/android` → 302 to APK
- `/api/og` → dynamic OG image
- `/public/robots.txt`, `/public/sitemap.xml`

## Notes
- Strictly grayscale; no colors other than black/white/gray.
- Keyboard‑accessible, focus rings, WCAG‑AA contrast.
- Animations are subtle and disabled/respected under `prefers-reduced-motion`.
