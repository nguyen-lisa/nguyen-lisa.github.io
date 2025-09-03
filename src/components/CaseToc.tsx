"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

function getNavOffset(): number {
  // Prefer real header height if you add id="site-header" to your Navbar
  const header = document.getElementById("site-header");
  if (header) return header.getBoundingClientRect().height + 20;

  // Fallback to CSS var --nav-h (keep it in sync in globals.css)
  const css = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const navH = parseInt(css || "56", 10) || 56;
  return navH + 20;
}

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  // stable list of ids in order
  const ids = useMemo(() => items.map(i => i.id), [items]);

  // store computed heading tops and current offset
  const topsRef = useRef<number[]>([]);
  const offsetRef = useRef<number>(getNavOffset());
  const BUFFER = 32; // px padding around section boundaries to prevent flicker

  const computeTops = () => {
    offsetRef.current = getNavOffset();
    topsRef.current = ids.map(id => {
      const el = document.getElementById(id) as HTMLElement | null;
      return el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY) : Number.POSITIVE_INFINITY;
    });
  };

  useEffect(() => {
    if (!ids.length) return;

    // initial positions
    computeTops();

    // honor hash on load
    const initial = decodeURIComponent(window.location.hash.replace("#", ""));
    if (initial && ids.includes(initial)) setActive(initial);
    else setActive(ids[0]);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY + offsetRef.current;

        const docBottom = window.scrollY + window.innerHeight;
        const maxScroll = document.documentElement.scrollHeight || document.body.scrollHeight;

        // If at (or very near) bottom, lock to the last section (important for short pages)
        if (docBottom >= maxScroll - 4) {
          setActive(ids[ids.length - 1]);
          ticking = false;
          return;
        }

        // If above first heading, stay on the first
        if (y < (topsRef.current[0] ?? 0) - BUFFER) {
          setActive(ids[0]);
          ticking = false;
          return;
        }

        // Choose the section whose range [start, nextStart) contains the reading line
        let currentIndex = ids.length - 1;
        for (let i = 0; i < topsRef.current.length - 1; i++) {
          const start = topsRef.current[i];
          const nextStart = topsRef.current[i + 1];
          if (y >= start - BUFFER && y < nextStart - BUFFER) {
            currentIndex = i;
            break;
          }
        }
        setActive(ids[currentIndex]);
        ticking = false;
      });
    };

    const onResize = () => {
      computeTops();
      onScroll();
    };

    const onHashChange = () => {
      const h = decodeURIComponent(window.location.hash.replace("#", ""));
      if (h && ids.includes(h)) setActive(h);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);

    // Recompute once the page settles (fonts/images)
    setTimeout(() => { computeTops(); onScroll(); }, 0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [ids]);

  if (!items.length) return null;

  return (
    <nav aria-label="Page Menu" className="text-sm">
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
                  const top = el.getBoundingClientRect().top + window.scrollY - offsetRef.current;
                  window.scrollTo({ top, behavior: "smooth" });
                  setActive(id); // immediate feedback
                  history.replaceState(null, "", `#${id}`);
                }}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group flex items-center gap-2 rounded px-2 py-1.5 transition outline-none",
                  "focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "text-accent border-2 border-accent"
                    : "text-text/80 border border-border hover:text-accent hover:border-accent/60"
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
