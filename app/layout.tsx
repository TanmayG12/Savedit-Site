import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "@/src/components/AppThemeProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SavedIt",
  description: "One place for all your saves.",
  openGraph: {
    title: "SavedIt",
    description: "One place for all your saves.",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "SavedIt" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppThemeProvider>
          <Header />
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
