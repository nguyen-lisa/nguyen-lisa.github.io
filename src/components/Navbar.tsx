// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname?.startsWith("/#");

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 bg-base/80 backdrop-blur border-b border-border"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <Link href="/" className="font-semibold text-lg">
          Lisa Nguyen
        </Link>

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          {/* Make Home the same height as the button, with subtle active state */}
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={[
              "inline-flex items-center justify-center h-9 px-3 rounded text-sm transition",
              "focus-visible:ring-2 focus-visible:ring-accent",
              isHome
                ? "text-accent border-2 border-accent"
                : "text-text/90 border border-transparent hover:text-accent hover:border-border",
            ].join(" ")}
          >
            Home
          </Link>

          {/* Match height; outline style so it doesn’t overpower Home */}
          <a
            href="/LisaNguyenResume.pdf"
            className="btn btn-white"
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
