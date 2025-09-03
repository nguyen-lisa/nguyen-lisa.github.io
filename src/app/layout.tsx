// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Your Name – Portfolio",
  description: "Accessibility-first · UI/UX · Front-end",
  metadataBase: new URL("https://your-domain.example"), // replace later
  openGraph: {
    title: "Your Name – Portfolio",
    description: "Accessibility-first · UI/UX · Front-end",
    url: "https://your-domain.example",
    siteName: "Your Name",
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
