"use client";

import Image from "next/image";
import { projects } from "@/lib/data";

export default function ProjectsFolderContent({
  onOpenProject,
}: {
  onOpenProject: (slug: string) => void;
}) {
  return (
    <div>
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4">
        {projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => onOpenProject(project.slug)}
            className="group flex flex-col items-center gap-2 rounded-xl p-2 text-center outline-none transition-colors hover:bg-background focus-visible:bg-background"
          >
            <Image
              src="/icons/project-file.png"
              alt=""
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0 group-active:scale-95"
            />
            <span className="line-clamp-2 text-xs font-medium text-foreground/80">
              {project.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
