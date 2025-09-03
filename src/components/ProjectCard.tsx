"use client";
import Link from "next/link";
import type { Project } from "contentlayer/generated";
import { toolLabel } from "@/data/tools";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-border p-5 hover:shadow-sm transition">
      <h3 className="text-lg font-semibold">
        <Link href={project.url} className="link">{project.title}</Link>
      </h3>

      <p className="mt-2 text-sm text-text/80">{project.summary}</p>

      {project.tools?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.tools.map((t) => (
            <li key={t} className="text-xs rounded-full border border-border px-2 py-1">
              {toolLabel(t as any)}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={project.url} className="btn btn-outline">Case Study</Link>
        {project.demo?.url && (
          <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.demo.url}>
            {project.demo.label ?? "Demo"}
          </a>
        )}
      </div>
    </article>
  );
}
