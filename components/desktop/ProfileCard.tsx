"use client";

import { profile } from "@/lib/data";
import ProfileVideo from "./ProfileVideo";

export default function ProfileCard({
  onMoreClick,
}: {
  onMoreClick: () => void;
}) {
  return (
    <div className="flex max-w-md flex-col gap-8 sm:flex-row sm:items-center pt-8">
      <div className="h-50 w-50 shrink-0 overflow-hidden rounded-full bg-accent shadow-md">
        <ProfileVideo className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="font-mono-label text-xs text-[var(--wallpaper-accent)]">
          {profile.role.toUpperCase()}
        </p>
        <p className="mt-2  whitespace-pre-line text-sm leading-relaxed text-[var(--wallpaper-foreground)]/80">
          {profile.shortBio}
        </p>
        <button
          type="button"
          onClick={onMoreClick}
          className="mt-3 text-sm font-semibold text-[var(--wallpaper-accent)] underline-offset-4 hover:underline"
        >
          더 알아보기 →
        </button>
      </div>
    </div>
  );
}
