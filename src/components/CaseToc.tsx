"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = items.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
    );
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="text-sm">
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => (
          <li key={id} className={level > 2 ? "pl-4" : ""}>
            <a
              href={`#${id}`}
              className={`block rounded px-2 py-1 transition ${
                active === id ? "border-2 border-accent text-accent" : "border border-border text-text/80"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
