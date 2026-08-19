export type DesktopTheme = {
  id: string;
  label: string;
  dot: string;
  /** Wallpaper gradient, top → bottom. */
  from: string;
  to: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  surface: string;
  glassBg: string;
  glassBorder: string;
  hoverTint: string;
  /** Text color for content sitting on the translucent glass surfaces
   *  (MenuBar, WidgetPanel cards, Dock) — separate from `foreground` because
   *  a theme's glass tint (light vs dark) doesn't always match its wallpaper
   *  text color, e.g. Sky uses light wallpaper text but white/light glass. */
  glassForeground: string;
  glassMuted: string;
  /** Accent-colored text sitting directly on the wallpaper (ProfileCard's
   *  role label / "더 알아보기" link) — separate from `accent` because Sky's
   *  light-blue accent nearly disappears against its own blue wallpaper,
   *  while every other theme's accent already contrasts fine there. */
  wallpaperAccent: string;
  /** Default-colored text sitting directly on the wallpaper (ProfileCard's
   *  bio paragraph, desktop icon labels) — separate from `foreground`
   *  because `foreground` also drives the solid white modal windows, which
   *  must keep dark text regardless of what the wallpaper needs. */
  wallpaperForeground: string;
  /** MenuBar's own text color. MenuBar shares WidgetPanel's glass background
   *  value, but a theme may still want the top bar to look different from
   *  the widgets (e.g. always white), so it gets its own token instead of
   *  reusing `glassForeground`. */
  menuForeground: string;
  dark?: boolean;
};

export const desktopThemes: DesktopTheme[] = [
  {
    id: "sky",
    label: "Sky",
    dot: "#6d84ac",
    from: "#5b7099",
    to: "#9fb0cf",
    accent: "#7fb2e8",
    accentSoft: "#2c3b5c",
    background: "#141a2e",
    foreground: "#f2f4fa",
    muted: "#98a2c0",
    border: "#33406a",
    surface: "#1a2140",
    glassBg: "rgba(255,255,255,0.32)",
    glassBorder: "rgba(255,255,255,0.14)",
    hoverTint: "rgba(0,0,0,0.05)",
    glassForeground: "#1f2a44",
    glassMuted: "#5b6b8c",
    wallpaperAccent: "#ffffff",
    wallpaperForeground: "#f2f4fa",
    menuForeground: "#1f2a44",
    dark: true,
  },
  {
    id: "blossom",
    label: "Blossom",
    dot: "#6b4f96",
    from: "#8c5cb3",
    to: "#d17bac",
    accent: "#7a4fa8",
    accentSoft: "#ecdcf5",
    background: "#faf3fb",
    foreground: "#241a30",
    muted: "#7a6a88",
    border: "#e9d9f2",
    surface: "#ffffff",
    glassBg: "rgba(255,255,255,0.32)",
    glassBorder: "rgba(255,255,255,0.14)",
    hoverTint: "rgba(0,0,0,0.05)",
    glassForeground: "#241a30",
    glassMuted: "#7a6a88",
    wallpaperAccent: "#ffffff",
    wallpaperForeground: "#ffffff",
    menuForeground: "#ffffff",
  },
  {
    id: "meadow",
    label: "Meadow",
    dot: "#4f8f5a",
    from: "#2f5a3b",
    to: "#e3f2c9",
    accent: "#2f6b3a",
    accentSoft: "#dcefc0",
    background: "#f2f8ea",
    foreground: "#17170f",
    muted: "#5c6b56",
    border: "#d8e8c8",
    surface: "#ffffff",
    glassBg: "rgba(255,255,255,0.32)",
    glassBorder: "rgba(255,255,255,0.14)",
    hoverTint: "rgba(0,0,0,0.05)",
    glassForeground: "#17170f",
    glassMuted: "#5c6b56",
    wallpaperAccent: "#ffffff",
    wallpaperForeground: "#ffffff",
    menuForeground: "#ffffff",
  },
  {
    id: "dark",
    label: "Dark",
    dot: "#1c1c1c",
    from: "#4a4a50",
    to: "#0b0b0c",
    accent: "#4fae7a",
    accentSoft: "#1e2f24",
    background: "#141416",
    foreground: "#f2f1ec",
    muted: "#9a9a94",
    border: "#333330",
    surface: "#1d1d1f",
    glassBg: "rgba(24,24,26,0.4)",
    glassBorder: "rgba(255,255,255,0.06)",
    hoverTint: "rgba(255,255,255,0.08)",
    glassForeground: "#f2f1ec",
    glassMuted: "#9a9a94",
    wallpaperAccent: "#ffffff",
    wallpaperForeground: "#ffffff",
    menuForeground: "#ffffff",
    dark: true,
  },
];
