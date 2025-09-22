"use client";
//import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
        Hi, I’m Lisa Nguyen.
      </h1>

      <p className="mt-2 text-text/80">
        Accessibility-first · UI/UX Design · Full Stack Development
      </p>

      <p
        id="about-hero"
        className="mt-4 mx-auto max-w-prose text-base sm:text-lg text-text/80"
      >
        IT graduate and full-stack engineer specializing in UI/UX and accessibility. I architect information architecture (IA), create wireframes and interactive prototypes, and ship inclusive, high-contrast interfaces with keyboard-first flows and measurable performance gains. I emphasize pragmatic UX, WCAG-aligned practices (axe/Lighthouse), and resilient, maintainable code across the stack.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3 not-prose">
        {/* Open resume in a new tab to avoid losing context */}
        <a
          href="/LisaNguyenResume.pdf"
          className="btn btn-white"
          target="_blank"
          rel="noreferrer"
        >
          View Resume
        </a>

        {/* Mailto with a prefilled subject */}
        <a
          href={`mailto:lisanguyen.tech@yahoo.com?subject=${encodeURIComponent(
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