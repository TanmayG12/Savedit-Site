import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppThemeProvider from "@/src/components/AppThemeProvider";
import { baseMetadata, structuredData } from "@/lib/seo";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          key="savedit-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <AppThemeProvider>
          <div id="app-fade-root">
            {children}
            <Toaster />
          </div>
        </AppThemeProvider>
      </body>
    </html>
  );
}
