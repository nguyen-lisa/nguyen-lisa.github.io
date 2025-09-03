"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Logo / Name */}
        <Link href="/" className="font-semibold text-lg">
          Your Name
        </Link>

        {/* Nav links */}
        <nav className="flex gap-6 text-sm">
         <Link href="/" className="link">Home</Link>
         <a href="/LisaNguyenResume.pdf" className="link" target="_blank" rel="noreferrer">Resume</a>
        </nav>
      </div>
    </header>
  );
}
