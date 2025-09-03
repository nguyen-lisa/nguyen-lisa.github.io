import { allProjects } from "contentlayer/generated";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilters from "@/components/ProjectFilters";
import { toolLabel } from "@/data/tools";

export default function HomePage() {
  const projects = [...allProjects].sort((a, b) => b.date.localeCompare(a.date));
  const featured = projects.filter(p => p.featured);

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section aria-labelledby="home-hero" className="text-center space-y-4">
        <h1 id="home-hero" className="text-4xl md:text-5xl font-bold tracking-tight">
          Lisa Nguyen
        </h1>
        <p className="text-lg text-text/80">Accessibility-first · UI/UX · Front-end</p>
        <p className="text-text/90">I ship accessible, fast UIs users love.</p>

        {/* toolkit chips */}
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {["nextjs", "tailwind", "ts"].map(k => (
            <li key={k} className="text-xs rounded-full border border-border px-2 py-1">
              {toolLabel(k as any)}
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-4 pt-2">
          <a href="/resume" className="btn btn-outline">View Resume</a>
          <a href="mailto:you@email.com" className="btn btn-accent">Email me</a>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="text-2xl font-semibold mb-4">Featured</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {featured.map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="text-2xl font-semibold mb-4">Projects</h2>
        <ProjectFilters projects={projects} />
      </section>
    </div>
  );
}
