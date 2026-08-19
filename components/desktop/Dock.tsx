"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type DragEvent } from "react";

type DockApp = {
  name: string;
  src: string;
};

const INITIAL_APPS: DockApp[] = [
  { name: "Figma", src: "/dock/figma-white.png" },
  { name: "Claude", src: "/dock/claude-white.png" },
  { name: "ChatGPT", src: "/dock/chatgpt-white.png" },
  { name: "Notion", src: "/dock/notion-white.png" },
  { name: "Gemini", src: "/dock/gemini-white.png" },
];

const ICON_SIZE = 48; // px, matches h-12 w-12
const MAX_SCALE = 1.6;
const EFFECT_RANGE = 90; // px either side of an icon that the cursor influences
const EASE = 0.22; // per-frame lerp factor — lower = softer, slower catch-up
const STORAGE_KEY = "dock-order";

function reorder<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function saveOrder(list: DockApp[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map((app) => app.name)));
  } catch {
    // Storage unavailable (private browsing, disabled, etc.) — order just won't persist.
  }
}

function loadSavedOrder(): DockApp[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const savedNames: unknown = JSON.parse(raw);
    if (!Array.isArray(savedNames)) return null;

    const byName = new Map(INITIAL_APPS.map((app) => [app.name, app]));
    const restored = savedNames
      .map((name) => (typeof name === "string" ? byName.get(name) : undefined))
      .filter((app): app is DockApp => Boolean(app));

    // Fold in any apps that weren't part of a previously saved order (e.g. a
    // new icon added after the user already customized their layout).
    const restoredNames = new Set(restored.map((app) => app.name));
    const missing = INITIAL_APPS.filter((app) => !restoredNames.has(app.name));
    const merged = [...restored, ...missing];

    return merged.length === INITIAL_APPS.length ? merged : null;
  } catch {
    return null;
  }
}

/**
 * macOS-dock-style magnification: icons scale up the closer the cursor gets,
 * with a smooth cosine falloff to neighbors, animated by lerping toward the
 * target scale every frame (rAF) instead of snapping on each mousemove —
 * that's what gives it the fluid, springy feel instead of a jumpy CSS hover.
 *
 * Each icon's own horizontal margin grows in lockstep with its scale (half
 * the extra width on each side), so it pushes its neighbors apart by exactly
 * the amount it overflows its original box instead of overlapping them.
 *
 * Icons are also drag-reorderable (native HTML5 DnD): dragging one over
 * another live-swaps their positions, same as rearranging the real macOS
 * dock. Magnification is paused for the duration of a drag so the two
 * transform-driven interactions don't fight each other.
 */
export default function Dock() {
  const [apps, setApps] = useState<DockApp[]>(INITIAL_APPS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scalesRef = useRef<number[]>(INITIAL_APPS.map(() => 1));
  const mouseXRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  // Runs once on mount, after hydration, so the server-rendered default
  // order never mismatches — then swaps in whatever the user last dragged
  // it to. Deferred via setTimeout so the state update happens outside the
  // effect's synchronous body (avoids a cascading-render lint warning).
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = loadSavedOrder();
      if (saved) setApps(saved);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let rafId: number;
    function tick() {
      const mouseX = draggingRef.current ? null : mouseXRef.current;

      // Bail out of the whole frame while the dock is idle — cursor away and
      // every icon already relaxed back to rest. This check must come before
      // any geometry read: getBoundingClientRect() forces a synchronous
      // layout, so measuring first and skipping afterwards would still
      // thrash layout 60x/sec forever, which in turn makes every
      // backdrop-filter surface on the page re-sample and visibly flicker.
      const atRest = scalesRef.current.every(
        (scale) => Math.abs((scale ?? 1) - 1) < 0.001,
      );
      if (mouseX === null && atRest) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      apps.forEach((_, i) => {
        const wrapper = wrapperRefs.current[i];
        const icon = iconRefs.current[i];
        if (!wrapper || !icon) return;

        const rect = wrapper.getBoundingClientRect();
        const center = rect.left + rect.width / 2;

        let target = 1;
        if (mouseX !== null) {
          const distance = Math.abs(mouseX - center);
          const t = Math.min(distance / EFFECT_RANGE, 1);
          const falloff = Math.cos((t * Math.PI) / 2);
          target = 1 + (MAX_SCALE - 1) * falloff;
        }

        const current = scalesRef.current[i] ?? 1;
        const next = current + (target - current) * EASE;
        // Snap to exactly 1 once the easing has essentially converged, so
        // the idle check above can actually latch instead of chasing an
        // asymptote forever.
        scalesRef.current[i] = Math.abs(next - 1) < 0.001 ? 1 : next;

        icon.style.transform = `scale(${scalesRef.current[i]})`;
        const extraMargin = ((scalesRef.current[i] - 1) * ICON_SIZE) / 2;
        wrapper.style.marginLeft = `${extraMargin}px`;
        wrapper.style.marginRight = `${extraMargin}px`;
      });
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [apps]);

  function handleDragStart(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      setDraggedIndex(index);
      event.dataTransfer.effectAllowed = "move";
      // Firefox requires data to be set for the drag to actually start.
      event.dataTransfer.setData("text/plain", apps[index].name);
    };
  }

  function handleDragOver(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      setApps((prev) => {
        const next = reorder(prev, draggedIndex, index);
        saveOrder(next);
        return next;
      });
      setDraggedIndex(index);
    };
  }

  function handleDragEnd() {
    draggingRef.current = false;
    setDraggedIndex(null);
    mouseXRef.current = null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2 px-4">
      <p className="font-mono-label text-[10px] text-white">TECH STACK</p>
      <div
        onMouseMove={(event) => {
          mouseXRef.current = event.clientX;
        }}
        onMouseLeave={() => {
          mouseXRef.current = null;
        }}
        className="glass-dither pointer-events-auto flex items-end gap-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-[4px] backdrop-saturate-150"
      >
        {apps.map((app, i) => (
          <div
            key={app.name}
            ref={(el) => {
              wrapperRefs.current[i] = el;
            }}
            draggable
            onDragStart={handleDragStart(i)}
            onDragOver={handleDragOver(i)}
            onDragEnd={handleDragEnd}
            className={`group relative flex flex-col items-center ${
              draggedIndex === i ? "opacity-40" : "opacity-100"
            }`}
          >
            <span className="pointer-events-none absolute -top-14 rounded-md bg-foreground px-2 py-1 text-[10px] font-medium whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100">
              {app.name}
            </span>
            <span
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              className="pointer-events-none relative block h-12 w-12 origin-bottom overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 will-change-transform"
            >
              <Image
                src={app.src}
                alt={app.name}
                fill
                sizes="48px"
                unoptimized
                className="object-cover"
                draggable={false}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
