"use client";

import { useEffect, useState } from "react";
import CaseToc, { TocItem } from "./CaseToc";

export default function StickyCollapsibleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

  // Open on desktop (≥lg), collapsed below
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setOpen(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setOpen(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  if (!items.length) return null;

  return (
    <aside
      className={[
        "sticky self-start top-[calc(var(--nav-h)+10px)]",
        "border-r border-border/50",
        "shrink-0",                          // <-- do not shrink
        open ? "w-[240px] md:w-[260px]" : "w-11" // 44px rail when collapsed
      ].join(" ")}
      aria-label="On this page sidebar"
    >
      {/* Rail header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          className="btn btn-outline px-2 py-1 text-xs"
          title={open ? "Collapse table of contents" : "Expand table of contents"}
        >
          {open ? "Hide" : "TOC"}
        </button>
        {open && <span className="text-xs text-text/60">On this page</span>}
      </div>

      {/* Scrollable TOC inside fixed-width column */}
      {open && (
        <div className="max-h-[calc(100dvh-var(--nav-h)-2.5rem)] overflow-auto pr-2 md:pr-3">
          <CaseToc items={items} />
        </div>
      )}
    </aside>
  );
}
