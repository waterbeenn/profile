"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type DesktopWindowProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
  contentMaxHeightClassName?: string;
  /** Nudges the window off-center, e.g. so a window opened from inside
   * another one (a "file" opened from its "folder") visually reads as a
   * new window stacked on top rather than exactly overlapping it. */
  offsetClassName?: string;
};

export default function DesktopWindow({
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-2xl",
  contentMaxHeightClassName = "max-h-[70vh]",
  offsetClassName = "",
}: DesktopWindowProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`animate-window-in w-full ${maxWidthClassName} ${offsetClassName} overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-2xl`}
      >
        <div className="flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <p className="flex-1 text-center text-xs font-medium text-muted">{title}</p>
          {/* Invisible mirror of the traffic-light cluster so the title's flex-1
              box is flanked by equal-width margins and its text lands on the
              window's true horizontal center, not just the center of the
              space to the right of the buttons. */}
          <div className="flex items-center gap-2 opacity-0" aria-hidden="true">
            <span className="h-3 w-3 rounded-full" />
            <span className="h-3 w-3 rounded-full" />
            <span className="h-3 w-3 rounded-full" />
          </div>
        </div>
        <div className={`glass-scrollbar ${contentMaxHeightClassName} overflow-y-auto p-6 sm:p-8`}>{children}</div>
      </div>
    </div>
  );
}
