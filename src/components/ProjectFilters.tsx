"use client";
import { useMemo, useState } from "react";
import type { Project } from "contentlayer/generated";
import ProjectCard from "./ProjectCard";
import { toolKeys, toolLabel } from "@/data/tools";

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>((acc, k) => ((acc[k] = (acc[k] ?? 0) + 1), acc), {});
}

export default function ProjectFilters({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<"featured" | "all" | "recent" | "cat">("all");
  const [cat, setCat] = useState<string | null>(null);
  const [tool, setTool] = useState<string>("");

  const featured = projects.filter(p => p.featured);

  const categories = useMemo(() => {
    const cats = projects.flatMap(p => p.categories ?? []);
    const counts = countBy(cats);
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [projects]);

  // choose the base list for the current tab
  const base =
    tab === "featured" ? featured :
    tab === "recent"   ? projects : // already sorted by date upstream
    tab === "cat"      ? projects.filter(p => (cat ? (p.categories ?? []).includes(cat) : true)) :
                          projects;

  // apply tool filter
  const filtered = tool ? base.filter(p => (p.tools ?? []).includes(tool)) : base;

  return (
    <div className="space-y-4">
      {/* Tabs + Tool filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTab("featured")}
          className={`btn btn-outline px-3 py-1.5 ${tab === "featured" ? "border-2 border-accent text-accent" : ""}`}
        >
          Featured ({featured.length})
        </button>
        <button
          onClick={() => setTab("all")}
          className={`btn btn-outline px-3 py-1.5 ${tab === "all" ? "border-2 border-accent text-accent" : ""}`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setTab("recent")}
          className={`btn btn-outline px-3 py-1.5 ${tab === "recent" ? "border-2 border-accent text-accent" : ""}`}
        >
          Most Recent
        </button>

        {categories.map(([name, count]) => (
          <button
            key={name}
            onClick={() => { setTab("cat"); setCat(name); }}
            className={`btn btn-outline px-3 py-1.5 ${tab === "cat" && cat === name ? "border-2 border-accent text-accent" : ""}`}
          >
            {name} ({count})
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="tool" className="text-sm">Filter by tool</label>
          <select
            id="tool"
            className="border border-border bg-base rounded px-2 py-1"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="">All tools</option>
            {toolKeys.map(k => <option key={k} value={k}>{toolLabel(k)}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
      </div>
    </div>
  );
}
