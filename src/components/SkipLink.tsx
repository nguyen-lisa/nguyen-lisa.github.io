export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3
                 bg-base text-text border border-border rounded px-3 py-2 shadow
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      Skip to content
    </a>
  );
}
