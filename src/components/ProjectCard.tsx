"use client";
import Link from "next/link";
import type { Project } from "contentlayer/generated";
import { toolLabel } from "@/data/tools";

// Locale-aware formatter
const dtf = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" });

// Parse YYYY-MM-DD robustly and ignore bad values
function parseISODate(iso?: string): Date | null {
  if (!iso) return null;
  const s = String(iso).trim().replace(/\r|\n/g, "");
  // Prefer exact YYYY-MM-DD
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) {
    const [, y, mo, d] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d));
  }
  // Fallback to native parser
  const d2 = new Date(s);
  return Number.isNaN(d2.getTime()) ? null : d2;
}

function formatDate(iso?: string): string | null {
  const d = parseISODate(iso);
  return d ? dtf.format(d) : null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const prettyDate = formatDate(project.date);

  return (
    <article className="rounded-2xl border border-border p-5 hover:shadow-sm transition">
      <h3 className="text-lg font-semibold">
        <Link href={project.url} className="link">{project.title}</Link>
      </h3>

      {prettyDate && (
        <p className="mt-1 text-xs text-text/60">
          <time dateTime={project.date!} aria-label={`Published ${prettyDate}`}>
            {prettyDate}
          </time>
        </p>
      )}

      <p className="mt-2 text-sm text-text/80">{project.summary}</p>

      {(project.tools?.length ?? 0) > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.tools!.map((raw) => {
            const key = String(raw).trim().toLowerCase();
            const label = toolLabel(key);
            if (!label) return null;
            return (
              <li key={key} className="text-xs rounded-full border border-border px-2 py-1">
                {label}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={project.url} className="btn btn-outline">Case Study</Link>

        {project.demo?.url && (
          <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.demo.url}>
            {project.demo.label ?? "Demo"}
          </a>
        )}

        {project.repo && (
          <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.repo}>
            Source
          </a>
        )}
      </div>
    </article>
  );
}
