import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import GithubSlugger from "github-slugger";

import Image from "next/image";
import CaseToc, { TocItem } from "@/components/CaseToc";
import ImageGrid from "@/components/ImageGrid";
import Subhead from "@/components/Subhead";

/* ---------- TOC extraction ---------- */
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
    const level = m[1].length; // h2–h4
    const text = m[2].replace(/[#*`]+/g, "").trim();
    items.push({ id: slugger.slug(text), text, level });
  }
  return items;
}

/* ---------- SSG params ---------- */
export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

/* ---------- SEO metadata per project ---------- */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const project = allProjects.find((p) => p.slug === params.slug);
  if (!project) return { title: "Project not found" };

  const url = `/project/${project.slug}`;
  return {
    title: `${project.title} · Case Study`,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} · Case Study`,
      description: project.summary,
      url,
      images: project.ogImage ? [project.ogImage] : ["/og/default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Case Study`,
      description: project.summary,
      images: project.ogImage ? [project.ogImage] : ["/og/default.png"],
    },
    robots: { index: true, follow: true },
  };
}

/* ---------- Page ---------- */
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  const toc = extractHeadings(project.body.raw);

  return (
    <>
      {/* Mobile: collapsible Menu */}
      {toc.length > 0 && (
        <div className="lg:hidden sticky top-20 z-10 mb-4">
          <details className="border border-border/60 rounded bg-base/95">
            <summary className="px-3 py-2 cursor-pointer select-none">Menu</summary>
            <div className="p-3">
              <nav aria-label="Page menu">
                <CaseToc items={toc} />
              </nav>
            </div>
          </details>
        </div>
      )}

      {/* Two columns from lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT rail (sticky) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <div className="max-h-[calc(100vh-10rem)] overflow-auto rounded-xl border border-border/60 bg-base/80 p-3">
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
              <div className="mt-4 relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden border border-border">
                <Image
                  src={project.thumbnail}
                  alt={
                    project.summary
                      ? `${project.title} — ${project.summary}`
                      : `${project.title} preview`
                  }
                  fill
                  className="object-cover"
                  // Slightly tighter sizes for desktop perf
                  sizes="(min-width: 1536px) 1100px, (min-width: 1280px) 1000px, (min-width: 1024px) 900px, 100vw"
                  priority
                  fetchPriority="high"
                />
              </div>
            )}
          </header>

          <MDXRemote
            source={project.body.raw}
            components={{ Subhead, ImageGrid }}
            options={{
              mdxOptions: {
                // remarkPlugins: [remarkGfm], // ⬅️ removed
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </article>
      </div>
    </>
  );
}
