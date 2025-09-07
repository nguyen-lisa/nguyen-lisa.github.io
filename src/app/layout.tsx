import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? ""; // "" locally, "/my-portfolio" in CI

export const metadata: Metadata = {
  title: "Lisa Nguyen - Portfolio",
  description: "Accessibility-first front-end and UI/UX portfolio. See featured projects, case studies, and resume.",
  // Must be origin-only:
  metadataBase: new URL("https://nguyen-lisa.github.io"),

  alternates: {
    canonical: `${BP}/`, // ensures canonical has the basePath on GH Pages
  },
  openGraph: {
    title: "Lisa Nguyen - Portfolio",
    description: "Accessibility-first · UI/UX · Front-end",
    url: `${BP}/`,
    siteName: "Lisa Nguyen",
    images: [`${BP}/og/home.png`], // prefix assets with basePath
  },
  twitter: {
    card: "summary_large_image",
    images: [`${BP}/og/home.png`],
  },
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