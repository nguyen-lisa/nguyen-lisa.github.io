"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TocItem = { id: string; text: string; level: number };

function getNavOffset() {
  // Keep in sync with globals.css :root --nav-h
  const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 56;
  return NAV_H + 20; // matches your scroll-margin-top
}

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const headingEls = useRef<HTMLElement[]>([]);

  // Cache the IDs we care about
  const ids = useMemo(() => items.map(i => i.id), [items]);

  useEffect(() => {
    // Collect heading elements in DOM order
    headingEls.current = ids
      .map(id => document.getElementById(id) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    // If URL already has a hash, honor it
    const currentHash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (currentHash && ids.includes(currentHash)) {
      setActive(currentHash);
    } else if (ids[0]) {
      setActive(ids[0]);
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = getNavOffset();
        const y = window.scrollY + offset;
        // Pick the last heading whose top is above the offset line
        let current = ids[0] ?? null;
        for (const el of headingEls.current) {
          if (el.offsetTop <= y) current = el.id;
          else break; // headings are in order
        }
        setActive(current);
        ticking = false;
      });
    };

    const onResize = () => {
      // Re-run on resize because offsets change
      onScroll();
    };

    const onHashChange = () => {
      const h = decodeURIComponent(window.location.hash.replace("#", ""));
      if (h && ids.includes(h)) setActive(h);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHashChange);
    // Initial compute
    onScroll();

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

                    // match your CSS offset: --nav-h + 20
                    const NAV_H =
                    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 56;
                    const offset = NAV_H + 20;

                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });

                    // update active state immediately for visual feedback
                    setActive(id);

                    // update the hash without reloading
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
