"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const targets = items
      .map(i => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      entries => {
        // Pick the heading closest to the top (but visible)
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-70% 0px -20% 0px", threshold: [0, 1] }
    );

    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="On this page"
         className="rounded-2xl border border-border/60 bg-base/60 backdrop-blur p-3">
      <p className="px-2 pb-2 text-xs uppercase tracking-wide text-text/60">On this page</p>
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group flex items-center gap-2 rounded px-2 py-1.5 text-sm transition outline-none",
                  "focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "text-accent border border-accent"
                    : "text-text/80 border border-transparent hover:text-accent hover:border-accent/60"
                ].join(" ")}
                style={{ paddingLeft: level >= 3 ? 20 : 8 }}
              >
                {/* active indicator bar */}
                <span className={[
                  "h-4 w-1 rounded",
                  isActive ? "bg-accent" : "bg-border/20 group-hover:bg-accent/60"
                ].join(" ")} />
                <span>{text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
