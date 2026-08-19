"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../icons";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatClock(date: Date) {
  const weekday = WEEKDAYS[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday}) ${hours}:${minutes}`;
}

export default function MenuBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const intervalId = window.setInterval(update, 1000 * 30);
    const initialId = window.setTimeout(update, 0);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(initialId);
    };
  }, []);

  return (
    <header className="glass-dither flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--glass-bg)] px-5 py-2.5 text-sm text-[var(--menu-foreground)] backdrop-blur-[4px] backdrop-saturate-150">
      <p className="font-bold">{profile.name}</p>
      <div className="flex items-center gap-4 text-[var(--menu-foreground)]/70">
        <div className="hidden items-center gap-3 sm:flex">
          <a href={`https://${profile.social.github}`} aria-label="GitHub" className="transition-opacity hover:opacity-60">
            <GithubIcon size={15} />
          </a>
          <a
            href={`https://${profile.social.instagram.replace("@", "")}`}
            aria-label="Instagram"
            className="transition-opacity hover:opacity-60"
          >
            <InstagramIcon size={15} />
          </a>
          <a href={`https://${profile.social.linkedin}`} aria-label="LinkedIn" className="transition-opacity hover:opacity-60">
            <LinkedinIcon size={15} />
          </a>
        </div>
        <p className="font-mono-label text-xs tabular-nums">
          {now ? formatClock(now) : " "}
        </p>
      </div>
    </header>
  );
}
