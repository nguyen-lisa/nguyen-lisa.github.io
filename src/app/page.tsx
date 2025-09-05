// src/app/page.tsx
import type { Metadata } from "next";
import type { Project } from "contentlayer/generated";
import { allProjects } from "contentlayer/generated";
import Hero from "@/components/Hero";
import ProjectFilters from "@/components/ProjectFilters";

export const metadata: Metadata = { title: "Home · Lisa Nguyen" };

export default function HomePage() {
  const projects: Project[] = [...allProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Hero />
      <section aria-labelledby="projects-heading" className="mt-6 sm:mt-8 cv-auto">
        <h2 id="projects-heading" className="sr-only">Projects</h2>
        <ProjectFilters projects={projects} />
      </section>
    </>
  );
}
