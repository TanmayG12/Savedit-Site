import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "@/src/components/AppThemeProvider";

export const metadata: Metadata = {
  title: "SavedIt",
  description: "Save anything. Organize. Act.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
