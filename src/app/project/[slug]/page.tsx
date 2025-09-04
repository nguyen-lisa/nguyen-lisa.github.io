import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import CaseToc, { TocItem } from "@/components/CaseToc";
import GithubSlugger from "github-slugger";
import ImageGrid from "@/components/ImageGrid";
import Subhead from "@/components/Subhead";

function extractHeadings(raw: string): TocItem[] {
  const items: TocItem[] = [];
  const slugger = new GithubSlugger();
  let inCode = false;
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (t.startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = /^(#{2,4})\s+(.+)$/.exec(t);
    if (!m) continue;
    const level = m[1].length;           // h2–h4
    const text = m[2].replace(/[#*`]+/g, "").trim();
    items.push({ id: slugger.slug(text), text, level });
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
    <>
      {/* Mobile: collapsible Menu */}
      {toc.length > 0 && (
        <div className="lg:hidden sticky top-20 z-10 mb-4">
          <details className="border border-border/60 rounded bg-base/95 backdrop-blur">
            <summary className="px-3 py-2 cursor-pointer select-none">Menu</summary>
            <div className="p-3">
              <nav aria-label="Page menu">
                <CaseToc items={toc} />
              </nav>
            </div>
          </details>
        </div>
      )}

      {/* Two columns from lg+ — NOTE: no `items-start` here */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT rail (lg+): own column + sticky wrapper (parent now stretches) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <div className="max-h-[calc(100vh-10rem)] overflow-auto rounded-xl border border-border/60 bg-base/60 backdrop-blur p-3">
              <nav aria-label="Page menu">
                <CaseToc items={toc} />
              </nav>
            </div>
          </div>
        </aside>

        {/* RIGHT content */}
        <article className="prose max-w-none lg:col-span-9">
          <header className="mb-6">
            <h1 className="mb-2">{project.title}</h1>
            {project.summary && <p className="text-text/80">{project.summary}</p>}

            <div className="mt-4 flex flex-wrap gap-2 not-prose">
              {project.repo && (
                <a className="btn btn-outline" target="_blank" rel="noreferrer" href={project.repo}>
                  Repository
                </a>
              )}
              {project.demo?.url && (
                <a className="btn btn-accent" target="_blank" rel="noreferrer" href={project.demo.url}>
                  {project.demo.label ?? "Live Demo"}
                </a>
              )}
            </div>

            {project.thumbnail && (
              <img
                src={project.thumbnail}
                //alt={project.thumbnailAlt ?? `${project.title} preview`}
                className="mt-4 w-full rounded-xl border border-border"
                loading="eager"
                decoding="async"
              />
            )}
          </header>
          <MDXRemote
            source={project.body.raw}
            components={{ Subhead, ImageGrid }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </article>
      </div>
    </>
  );
}
