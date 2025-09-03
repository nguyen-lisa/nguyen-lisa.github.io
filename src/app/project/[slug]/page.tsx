import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import StickyCollapsibleToc from "@/components/StickyCollapsibleToc"; // ⬅️ use the wrapper
import type { TocItem } from "@/components/CaseToc"; // type only
import { slugify } from "@/lib/slug";

function extractHeadings(raw: string): TocItem[] {
  const items: TocItem[] = [];
  let inCode = false;
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (t.startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = /^(#{2,4})\s+(.+)$/.exec(t);
    if (!m) continue;
    const level = m[1].length; // 2–4
    const text = m[2].replace(/[#*`]+/g, "").trim();
    const id = slugify(text);
    items.push({ id, text, level });
  }
  return items;
}

export function generateStaticParams() {
  return allProjects.map(p => ({ slug: p.slug }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  const toc = extractHeadings(project.body.raw);

    return (
    <div className="flex gap-4 sm:gap-6">
        {/* LEFT: sticky rail that expands/collapses */}
        <StickyCollapsibleToc items={toc} />

        {/* RIGHT: content takes the rest, never underlaps */}
        <article className="prose max-w-none flex-1 min-w-0">
        <header className="mb-4 sm:mb-6">
            <h1 className="mb-2">{project.title}</h1>
            {project.summary && <p className="text-text/80">{project.summary}</p>}
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
            {project.repo && (
                <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.repo}>
                Repository
                </a>
            )}
            {project.demo?.url && (
                <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.demo.url}>
                {project.demo.label ?? "Demo"}
                </a>
            )}
            </div>
        </header>

        <MDXRemote
            source={project.body.raw}
            options={{
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
            },
            }}
        />
        </article>
    </div>
    );
}
