"use client";

import { useState } from "react";
import { desktopThemes } from "@/lib/desktopThemes";
import { projects } from "@/lib/data";
import MenuBar from "./MenuBar";
import ProfileCard from "./ProfileCard";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import WidgetPanel from "./WidgetPanel";
import Dock from "./Dock";
import AboutContent from "./windows/AboutContent";
import ResumeContent from "./windows/ResumeContent";
import ProjectsFolderContent from "./windows/ProjectsFolderContent";
import ProjectFileContent from "./windows/ProjectFileContent";
import ContactContent from "./windows/ContactContent";

type WindowId = "about" | "resume" | "projects" | "contact";

const ICONS: { id: WindowId; label: string; imageSrc: string }[] = [
  { id: "about", label: "About Me", imageSrc: "/icons/about-prism.png" },
  { id: "resume", label: "Resume", imageSrc: "/icons/skills-doc.png" },
  { id: "projects", label: "Projects", imageSrc: "/icons/projects-folder.png" },
  { id: "contact", label: "Contact", imageSrc: "/icons/contact-mail.png" },
];

const WINDOW_TITLES: Record<WindowId, string> = {
  about: "About Me",
  resume: "Resume",
  projects: "Projects",
  contact: "Contact Me",
};

export default function Desktop() {
  const [themeId, setThemeId] = useState(desktopThemes[0].id);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(
    null,
  );
  const theme = desktopThemes.find((t) => t.id === themeId) ?? desktopThemes[0];
  const activeProject = projects.find((p) => p.slug === activeProjectSlug);

  // Dark themes lighten smoothly toward the bottom in a single gradient
  // (mixing white straight into the end color) instead of layering a
  // separate glow on top, which was creating a visible seam/dip partway down.
  const bottomColor = theme.dark
    ? `color-mix(in srgb, ${theme.to} 55%, white 45%)`
    : theme.to;
  const background = `linear-gradient(180deg, ${theme.from}, ${bottomColor})`;

  const themeStyle: React.CSSProperties & Record<string, string> = {
    background,
    cursor: "url('/cursor.png') 1 1, auto",
    // Elements with no explicit text-* class inherit this directly, so they
    // don't get stuck on the stale color body's `color: var(--foreground)`
    // resolved to before this theme override.
    color: theme.foreground,
    "--foreground": theme.foreground,
    "--muted": theme.muted,
    "--border": theme.border,
    "--surface": theme.surface,
    "--accent": theme.accent,
    "--accent-soft": theme.accentSoft,
    "--background": theme.background,
    "--glass-bg": theme.glassBg,
    "--glass-border": theme.glassBorder,
    "--hover-tint": theme.hoverTint,
    "--glass-foreground": theme.glassForeground,
    "--glass-muted": theme.glassMuted,
    "--wallpaper-accent": theme.wallpaperAccent,
    "--wallpaper-foreground": theme.wallpaperForeground,
    "--menu-foreground": theme.menuForeground,
  };

  return (
    <div
      className="desktop-cursor relative flex min-h-screen flex-col"
      style={themeStyle}
    >
      <div
        className="desktop-noise pointer-events-none absolute inset-0 opacity-90"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <MenuBar />

        <main className="relative flex-1 px-6 py-10 pb-32 md:px-10 md:py-14">
          <div className="mx-auto flex w-full max-w-md -translate-x-16 flex-col items-center gap-8">
            <ProfileCard onMoreClick={() => setActiveWindow("about")} />
            <div className="flex flex-wrap justify-center gap-3 pt-10">
              {ICONS.map((item) => (
                <DesktopIcon
                  key={item.id}
                  imageSrc={item.imageSrc}
                  label={item.label}
                  onOpen={() => setActiveWindow(item.id)}
                />
              ))}
            </div>
          </div>
        </main>

        <div className="glass-scrollbar fixed top-16 right-4 z-20 max-h-[calc(100vh-5rem)] overflow-y-auto md:top-20 md:right-6">
          <WidgetPanel activeThemeId={theme.id} onThemeChange={setThemeId} />
        </div>

        <Dock />
      </div>

      {activeWindow && (
        <DesktopWindow
          title={WINDOW_TITLES[activeWindow]}
          onClose={() => {
            setActiveWindow(null);
            // Closing the Projects folder should close any file opened from
            // it too, rather than leaving that window stranded on its own.
            setActiveProjectSlug(null);
          }}
          maxWidthClassName={
            activeWindow === "resume"
              ? "max-w-3xl"
              : activeWindow === "about"
                ? "max-w-md"
                : "max-w-2xl"
          }
          contentMaxHeightClassName={
            activeWindow === "resume" ? "max-h-[calc(70vh+100px)]" : undefined
          }
        >
          {activeWindow === "about" && (
            <AboutContent onOpenProjects={() => setActiveWindow("projects")} />
          )}
          {activeWindow === "resume" && <ResumeContent />}
          {activeWindow === "projects" && (
            <ProjectsFolderContent onOpenProject={setActiveProjectSlug} />
          )}
          {activeWindow === "contact" && <ContactContent />}
        </DesktopWindow>
      )}

      {activeProject && (
        <DesktopWindow
          title={activeProject.title}
          onClose={() => setActiveProjectSlug(null)}
          offsetClassName="sm:translate-x-6 sm:translate-y-6"
        >
          <ProjectFileContent project={activeProject} />
        </DesktopWindow>
      )}
    </div>
  );
}
