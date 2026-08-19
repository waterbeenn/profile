import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

export default function ProjectFileContent({ project }: { project: Project }) {
  const summaryLines = project.summary
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);

  return (
    <div>
      <div
        className={`rounded-2xl bg-gradient-to-br p-5 text-[#17170f] ${project.gradient}`}
      >
        <p className="text-2xl font-black">{project.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-black/80">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] text-black/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-6 space-y-2.5">
        {summaryLines.map((line) => (
          <li
            key={line}
            className="flex gap-2 text-sm leading-relaxed text-muted"
          >
            <span className="mt-0.5 shrink-0 text-accent">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          Live
          <ArrowUpRight size={13} />
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          GitHub
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}
