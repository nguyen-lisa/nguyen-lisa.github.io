"use client";
import { useMemo, useState } from "react";
import type { Project } from "contentlayer/generated";
import ProjectCard from "./ProjectCard";
// import { toolKeys, toolLabel } from "@/data/tools"; // ← not needed while dropdown is disabled

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>(
    (acc, k) => ((acc[k] = (acc[k] ?? 0) + 1), acc),
    {}
  );
}

export default function ProjectFilters({ projects }: { projects: Project[] }) {
  // Tabs: featured | all | cat  (featured & recent is disabled for now)
  const [tab, setTab] = useState<"all" | "cat">("all");
  const [cat, setCat] = useState<string | null>(null);
  // const [tool, setTool] = useState<string>(""); // ← disabled for now

  //const featured = projects.filter((p) => p.featured);

  const categories = useMemo(() => {
    const cats = projects.flatMap((p) => p.categories ?? []);
    const counts = countBy(cats);
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [projects]);

  // Base list by tab
  const base =
    tab === "cat"
      ? projects.filter((p) => (cat ? (p.categories ?? []).includes(cat) : true))
      : projects;

  // Tool filter disabled for now
  // const filtered = tool ? base.filter((p) => (p.tools ?? []).includes(tool)) : base;
  const filtered = base;

  const tabClass = (active: boolean) =>
  `btn chip px-3 py-1.5 ${active ? "chip-active" : ""}`;

  return (
    <div className="space-y-4">
      {/* Tabs row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* <button onClick={() => setTab("featured")} className={tabClass(tab === "featured")}>
          Featured ({featured.length})
        </button> */}
        <button onClick={() => setTab("all")} className={tabClass(tab === "all")}>
          All ({projects.length})
        </button>
        {/*
        <button onClick={() => setTab("recent")} className={tabClass(tab === "recent")}>
          Most Recent
        </button>
        */}
        {categories.map(([name, count]) => (
          <button
            key={name}
            onClick={() => {
              setTab("cat");
              setCat(name);
            }}
            className={tabClass(tab === "cat" && cat === name)}
          >
            {name} ({count})
          </button>
        ))}

        {/* Tool dropdown (disabled for now)
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="tool" className="text-sm">Filter by tool</label>
          <select
            id="tool"
            className="border border-border bg-base rounded px-2 py-1"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="">All tools</option>
            {toolKeys.map((k) => (
              <option key={k} value={k}>{toolLabel(k)}</option>
            ))}
          </select>
        </div>
        */}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>
    </div>
  );
}
