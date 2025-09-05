// src/components/Hero.tsx
"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
        Hi, I’m Lisa.
      </h1>

      <p className="mt-2 text-text/80">
        Accessibility-first · UI/UX · Front-end
      </p>

      <p
        id="about-hero"
        className="mt-4 mx-auto max-w-prose text-base sm:text-lg text-text/80"
      >
        I design and build inclusive, high-contrast interfaces with clear
        information architecture and strong keyboard support. I care about
        pragmatic UX, performance, and clean front-end code.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3 not-prose">
        {/* Open résumé in a new tab to avoid losing context */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn btn-white"
        >
          View Résumé
        </a>

        {/* Mailto with a prefilled subject */}
        <a
          href={`mailto:your.email@example.com?subject=${encodeURIComponent(
            "Portfolio contact — Lisa Nguyen"
          )}`}
          className="btn btn-outline"
        >
          Contact
        </a>
      </div>
    </section>
  );
}
