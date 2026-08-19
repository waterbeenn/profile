"use client";

import Image from "next/image";

type DesktopIconProps = {
  imageSrc: string;
  label: string;
  onOpen: () => void;
};

export default function DesktopIcon({ imageSrc, label, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-20 flex-col items-center gap-2 rounded-xl py-2 outline-none transition-colors hover:bg-[var(--hover-tint)] focus-visible:bg-[var(--hover-tint)]"
    >
      <span className="relative flex h-14 w-14 items-center justify-center transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0 group-active:scale-95">
        <Image src={imageSrc} alt="" fill sizes="56px" unoptimized className="object-contain drop-shadow-sm" />
      </span>
      <span className="rounded px-1.5 py-0.5 text-xs font-medium text-[var(--wallpaper-foreground)]/80">
        {label}
      </span>
    </button>
  );
}
