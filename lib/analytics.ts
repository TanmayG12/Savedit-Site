// TODO: Wire this helper to the production analytics provider (e.g., Vercel Analytics or PostHog).
// For now it is a no-op so that components can safely invoke it without runtime errors.
export function trackEvent(event: string, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    // Uncomment to debug in development:
    // console.debug(`[analytics] ${event}`, payload);
  }
}
