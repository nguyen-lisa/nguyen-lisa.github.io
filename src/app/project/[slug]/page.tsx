import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import CaseToc, { TocItem } from "@/components/CaseToc";
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
    <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
      {/* Mobile TOC (collapsible) */}
      {toc.length > 0 && (
        <details className="lg:hidden border border-border rounded">
          <summary className="px-3 py-2 cursor-pointer select-none">
            On this page
          </summary>
          <div className="p-3">
            <CaseToc items={toc} />
          </div>
        </details>
      )}

      {/* Desktop sticky TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-auto pr-4 lg:border-r lg:border-border/50">
          <CaseToc items={toc} />
        </div>
      </aside>

      {/* Main article */}
      <article className="prose max-w-none lg:pl-4">
        <header className="mb-6">
          <h1 className="mb-2">{project.title}</h1>
          {project.summary && <p className="text-text/80">{project.summary}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
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
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </article>
    </div>
  );
}
