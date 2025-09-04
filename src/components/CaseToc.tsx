"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  // runtime state/refs (browser only)
  const offsetRef = useRef<number>(76);   // default: 56 (nav) + 20 margin
  const ids = useMemo(() => items.map(i => i.id), [items]);
  const topsRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Compute sticky/scroll offset safely in the browser
    const root = document.documentElement;
    const navVar = getComputedStyle(root).getPropertyValue("--nav-h");
    const cssNav = parseInt(navVar) || 56;
    const header = document.getElementById("site-header");
    const headerH = header?.getBoundingClientRect().height;
    offsetRef.current = (headerH ? Math.round(headerH) : cssNav) + 20;

    // Collect headings + their absolute top positions
    const els = ids
      .map(id => document.getElementById(id) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    const computeTops = () => {
      topsRef.current = els.map(el => el.getBoundingClientRect().top + window.scrollY);
    };
    computeTops();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY + offsetRef.current;
        const tops = topsRef.current;
        if (!tops.length) { ticking = false; return; }

        // bottom-of-page: lock to last
        const docBottom = window.scrollY + window.innerHeight;
        const maxScroll = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        if (docBottom >= maxScroll - 4) {
          setActive(ids[ids.length - 1]);
          ticking = false;
          return;
        }

        // Find the current section
        let idx = 0;
        for (let i = 0; i < tops.length; i++) {
          if (y >= tops[i]) idx = i;
          else break;
        }
        setActive(ids[idx]);
        ticking = false;
      });
    };

    const onResize = () => {
      computeTops();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
                  if (typeof window === "undefined") return;
                  const el = document.getElementById(id);
                  if (!el) return;
                  const top = el.getBoundingClientRect().top + window.scrollY - offsetRef.current;
                  window.scrollTo({ top, behavior: "smooth" });
                  setActive(id);
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
                <span
                  className={[
                    "h-4 w-1 rounded",
                    isActive ? "bg-accent" : "bg-border/30 group-hover:bg-accent/60",
                  ].join(" ")}
                />
                <span>{text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
