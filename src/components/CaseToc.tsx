"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const ids = useMemo(() => items.map(i => i.id), [items]);
  const offsetRef = useRef(76);            // ~56 header + 20
  const lockUntilRef = useRef(0);          // ignore IO updates while smooth-scrolling

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Compute offset from real header or CSS var
    const root = document.documentElement;
    const navVar = getComputedStyle(root).getPropertyValue("--nav-h");
    const cssNav = parseInt(navVar || "", 10) || 56;
    const header = document.getElementById("site-header");
    const headerH = header?.getBoundingClientRect().height ?? cssNav;
    offsetRef.current = Math.round(headerH) + 20;

    const headings = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    // Use IO only as a "tick"; we still compute the current section from window scroll
    const io = new IntersectionObserver(
      () => {
        // Respect the click lock so we don't snap back to the first section
        if (Date.now() < lockUntilRef.current) return;

        const y = window.scrollY + offsetRef.current + 1;

        // If we're at (or extremely near) the bottom, force last section
        const docBottom = window.scrollY + window.innerHeight;
        const maxScroll = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        if (docBottom >= maxScroll - 2) {
          setActive(ids[ids.length - 1] ?? null);
          return;
        }

        // Otherwise: pick the last heading whose top is <= y
        let current: string | null = ids[0] ?? null;
        for (const h of headings) {
          if (h.offsetTop <= y) current = h.id;
          else break;
        }
        setActive(current);
      },
      { root: null, rootMargin: `-${offsetRef.current}px 0px -60% 0px`, threshold: [0, 1] }
    );

    headings.forEach(h => io.observe(h));

    const onHashChange = () => {
      const hash = decodeURIComponent(location.hash.replace("#", ""));
      if (hash && ids.includes(hash)) setActive(hash);
    };
    window.addEventListener("hashchange", onHashChange);

    // Initial sync
    onHashChange();

    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [ids]);

  if (!items.length) return null;

  return (
    <nav aria-label="Page menu" className="text-sm">
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => {
          const isActive = active === id;
          return (
            <li key={id} className={level >= 3 ? "pl-4" : ""}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(id);
                  if (!el) return;

                  // Lock highlight during smooth scroll to avoid "snap back"
                  lockUntilRef.current = Date.now() + 650;
                  setActive(id);

                  const top = el.getBoundingClientRect().top + window.scrollY - offsetRef.current;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

                  history.replaceState(null, "", `#${id}`);
                }}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group flex items-center gap-2 rounded px-2 py-1.5 transition outline-none",
                  "focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "text-accent border-2 border-accent"
                    : "text-text/80 border border-border hover:text-accent hover:border-accent/60",
                ].join(" ")}
              >
                <span className={["h-4 w-1 rounded", isActive ? "bg-accent" : "bg-border/30 group-hover:bg-accent/60"].join(" ")} />
                <span>{text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
]