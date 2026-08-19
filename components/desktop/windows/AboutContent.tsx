"use client";

import { profile, techSkills, techSkillMax } from "@/lib/data";
import AboutProfileHeader from "./AboutProfileHeader";
import SkillRadarChart from "./SkillRadarChart";

export default function AboutContent({
  onOpenProjects,
}: {
  onOpenProjects: () => void;
}) {
  const bioParts = profile.longBio.split(/(Project)/);

  return (
    <div>
      <AboutProfileHeader />

      <div className="mt-6 border-t border-border" />

      <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">
        {bioParts.map((part, index) =>
          part === "Project" ? (
            <button
              key={index}
              type="button"
              onClick={onOpenProjects}
              className="font-semibold text-accent underline underline-offset-4 hover:opacity-80"
            >
              Project
            </button>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </p>

      <div className="mt-6 border-t border-border pt-6">
        <p className="font-mono-label text-xs text-accent">SKILLS</p>
        <div className="mt-4 flex justify-center">
          <SkillRadarChart skills={techSkills} maxScore={techSkillMax} />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {techSkills.map((skill) => (
            <span
              key={skill.name}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
            >
              {skill.name} {skill.score}/{techSkillMax}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
