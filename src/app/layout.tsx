// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Lisa Nguyen - Portfolio",
  description: "Accessibility-first · UI/UX · Front-end",
  metadataBase: new URL("https://your-domain.example"), // replace later
  openGraph: {
    title: "Lisa Nguyen - Portfolio",
    description: "Accessibility-first · UI/UX · Front-end",
    url: "https://your-domain.example",
    siteName: "Lisa Nguyen",
    images: ["/og/home.png"], // optional; add when ready
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* flex column so footer sits at bottom on short pages */}
      <body className="bg-base text-text min-h-dvh flex flex-col">
        <SkipLink />
        <Navbar />
        {/* main grows to fill; add site-wide padding + centered width here */}
        <main id="main" className="flex-1">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-5 py-4 sm:py-5">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
