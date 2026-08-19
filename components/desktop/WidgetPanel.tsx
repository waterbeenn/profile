"use client";

import { useEffect, useState } from "react";
import { desktopThemes, type DesktopTheme } from "@/lib/desktopThemes";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  GraduationCap,
  StickyNote,
  Sun,
  type LucideIcon,
} from "lucide-react";

type WidgetPanelProps = {
  activeThemeId: string;
  onThemeChange: (id: string) => void;
};

const GLASS =
  "glass-dither rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 text-[var(--glass-foreground)] shadow-lg shadow-black/5 backdrop-blur-[4px] backdrop-saturate-150";

export default function WidgetPanel({
  activeThemeId,
  onThemeChange,
}: WidgetPanelProps) {
  const activeTheme =
    desktopThemes.find((theme) => theme.id === activeThemeId) ??
    desktopThemes[0];

  return (
    <aside className="flex w-72 flex-col gap-3">
      <ThemeSwitcher
        activeThemeId={activeThemeId}
        onThemeChange={onThemeChange}
      />
      <WeatherWidget />
      <NowStudyingWidget accentColor={activeTheme.accent} />
      <StatusWidget accentColor={activeTheme.accent} />
    </aside>
  );
}

function ThemeSwitcher({ activeThemeId, onThemeChange }: WidgetPanelProps) {
  return (
    <div className={`${GLASS} flex items-center justify-between gap-3`}>
      <p className="font-mono-label text-[10px] whitespace-nowrap text-[var(--glass-muted)]">
        CHOOSE A THEME
      </p>
      <div className="flex gap-2">
        {desktopThemes.map((theme) => (
          <ThemeDot
            key={theme.id}
            theme={theme}
            active={theme.id === activeThemeId}
            onClick={() => onThemeChange(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeDot({
  theme,
  active,
  onClick,
}: {
  theme: DesktopTheme;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${theme.label} 테마로 변경`}
      aria-pressed={active}
      className={`h-6 w-6 shrink-0 rounded-full transition-transform ${
        active
          ? "scale-110 ring-2 ring-offset-2 ring-offset-[var(--surface)]"
          : "hover:scale-105"
      }`}
      style={{
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), ${theme.dot} 65%)`,
        ...(active ? { boxShadow: `0 0 0 2px ${theme.dot}` } : {}),
      }}
    />
  );
}

type Weather = {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
};

const WEATHER_ICONS: Record<string, LucideIcon> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
};

function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json() as Promise<Weather>;
      })
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const Icon = weather ? (WEATHER_ICONS[weather.icon] ?? CloudSun) : CloudSun;

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between">
        <p className="font-mono-label text-[10px] text-[var(--glass-muted)]">
          SEOUL
        </p>
        <Icon size={16} className="text-accent" />
      </div>
      {failed && (
        <p className="mt-2 text-[10px] text-[var(--glass-muted)]">
          불러오기 실패
        </p>
      )}
      {!failed && !weather && (
        <p className="mt-2 text-[10px] text-[var(--glass-muted)]">
          불러오는 중...
        </p>
      )}
      {weather && (
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-bold">{weather.temp}°</p>
          <p className="text-xs text-[var(--glass-muted)]">
            {weather.condition} · 체감 {weather.feelsLike}°
          </p>
        </div>
      )}
    </div>
  );
}

type InflearnCourse = {
  title: string;
  slug: string;
  progress: number;
  completeCount: number;
  lectureCount: number;
  thumbnailUrl: string;
};

type InflearnStats = {
  completedUnitCount: number;
  completedCourseCount: number;
  noteCount: number;
  learningTimeLabel: string;
};

type InflearnMonthly = {
  days: ContributionDay[];
  stats: InflearnStats;
};

// Inflearn's own dashboard shows activity the moment it happens, but this
// widget only fetched once on mount — a course studied after the tab was
// already open wouldn't show up until a manual page reload. Polling on an
// interval keeps it catching up on its own.
const INFLEARN_POLL_MS = 5 * 60 * 1000;

function usePolledJson<T>(url: string, intervalMs: number) {
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function load() {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("request failed");
          return res.json() as Promise<T>;
        })
        .then((result) => {
          if (!cancelled) {
            setData(result);
            setFailed(false);
          }
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    }

    load();
    const id = window.setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [url, intervalMs]);

  return { data, failed };
}

function useInflearnMonthly() {
  return usePolledJson<InflearnMonthly>("/api/inflearn-monthly", INFLEARN_POLL_MS);
}

function NowStudyingWidget({ accentColor }: { accentColor: string }) {
  const { data: coursesData, failed } = usePolledJson<{
    courses: InflearnCourse[];
  }>("/api/inflearn-progress", INFLEARN_POLL_MS);
  const courses = coursesData?.courses ?? null;
  const monthly = useInflearnMonthly();
  const monthLabel = new Date()
    .toLocaleDateString("ko-KR", { month: "long" })
    .toUpperCase();

  return (
    <div className={GLASS}>
      <div className="flex items-center justify-between">
        <p className="font-mono-label text-[10px] text-[var(--glass-muted)]">
          NOW STUDYING
        </p>
        <BookOpen size={14} className="text-accent" />
      </div>
      {failed && (
        <p className="mt-3 text-[10px] text-[var(--glass-muted)]">
          불러오기 실패
        </p>
      )}
      {!failed && !courses && (
        <p className="mt-3 text-[10px] text-[var(--glass-muted)]">
          불러오는 중...
        </p>
      )}
      {courses && courses.length === 0 && (
        <p className="mt-3 text-[10px] text-[var(--glass-muted)]">
          진행 중인 강의가 없어요.
        </p>
      )}
      {courses && courses.length > 0 && (
        <ul className="mt-3 space-y-3">
          {courses.map((course) => (
            <li key={course.slug}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="min-w-0 truncate text-[12px] font-semibold">
                  {course.title}
                </p>
                <span className="shrink-0 text-[10px] text-[var(--glass-muted)]">
                  {course.completeCount}/{course.lectureCount}강
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-black/10">
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 mb-1.5 font-mono-label text-[9px] text-[var(--glass-muted)]">
        {monthLabel}
      </p>
      <p className="mb-1.5 text-[8px] font-semibold tracking-wide text-[var(--glass-muted)]">
        INFLEARN
      </p>
      {monthly.failed && (
        <p className="text-[10px] text-[var(--glass-muted)]">불러오기 실패</p>
      )}
      {!monthly.failed && !monthly.data && (
        <p className="text-[10px] text-[var(--glass-muted)]">불러오는 중...</p>
      )}
      {monthly.data && (
        <div className="flex items-start gap-3">
          <ContributionMonthGrid
            days={monthly.data.days}
            accentColor={accentColor}
          />
          <InflearnStatsGrid stats={monthly.data.stats} />
        </div>
      )}
    </div>
  );
}

function InflearnStatsGrid({ stats }: { stats: InflearnStats }) {
  const items = [
    {
      icon: CheckCircle2,
      label: "완료 수업",
      value: `${stats.completedUnitCount}`,
    },
    { icon: Clock, label: "총 학습", value: stats.learningTimeLabel },
    { icon: StickyNote, label: "노트", value: `${stats.noteCount}` },
    {
      icon: GraduationCap,
      label: "완강",
      value: `${stats.completedCourseCount}`,
    },
  ];

  return (
    <div className="grid flex-1 grid-cols-2 gap-x-2 gap-y-2.5">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="min-w-0">
          <div className="flex items-center gap-1 text-[var(--glass-muted)]">
            <Icon size={10} />
            <span className="truncate text-[9px]">{label}</span>
          </div>
          <p className="mt-0.5 truncate text-xs font-medium">{value}</p>
        </div>
      ))}
    </div>
  );
}

type ContributionDay = { date: string; count: number };

function useContributionDays(url: string) {
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json() as Promise<{ days: ContributionDay[] }>;
      })
      .then((data) => {
        if (!cancelled) setDays(data.days);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { days, failed };
}

function StatusWidget({ accentColor }: { accentColor: string }) {
  const github = useContributionDays("/api/github-contributions");
  const leetcode = useContributionDays("/api/leetcode-contributions");
  const monthLabel = new Date()
    .toLocaleDateString("ko-KR", { month: "long" })
    .toUpperCase();

  return (
    <div className={GLASS}>
      <p className="font-mono-label text-[10px] text-[var(--glass-muted)]">
        STATUS
      </p>

      <p className="mt-3 mb-1.5 font-mono-label text-[9px] text-[var(--glass-muted)]">
        {monthLabel}
      </p>
      <div className="flex gap-4">
        <ContributionSection
          label="GITHUB"
          accentColor={accentColor}
          {...github}
        />
        <ContributionSection
          label="LEETCODE"
          accentColor={accentColor}
          {...leetcode}
        />
      </div>
    </div>
  );
}

function ContributionSection({
  label,
  days,
  failed,
  accentColor,
}: {
  label: string;
  days: ContributionDay[] | null;
  failed: boolean;
  accentColor: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[8px] font-semibold tracking-wide text-[var(--glass-muted)]">
        {label}
      </p>
      {failed && (
        <p className="text-[10px] text-[var(--glass-muted)]">불러오기 실패</p>
      )}
      {!failed && !days && (
        <p className="text-[10px] text-[var(--glass-muted)]">불러오는 중...</p>
      )}
      {days && <ContributionMonthGrid days={days} accentColor={accentColor} />}
    </div>
  );
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function ContributionMonthGrid({
  days,
  accentColor,
}: {
  days: ContributionDay[];
  accentColor: string;
}) {
  if (days.length === 0) return null;

  const leadingBlanks = new Date(`${days[0].date}T00:00:00`).getDay();
  const maxCount = Math.max(...days.map((day) => day.count), 1);

  return (
    <div className="grid grid-cols-[repeat(7,14px)] gap-[3px]">
      {WEEKDAY_LABELS.map((label) => (
        <span
          key={label}
          className="text-center text-[8px] text-[var(--glass-muted)]"
        >
          {label}
        </span>
      ))}
      {Array.from({ length: leadingBlanks }).map((_, index) => (
        <span key={`blank-${index}`} />
      ))}
      {days.map((day) => {
        const opacity =
          day.count === 0 ? 0.08 : 0.25 + (day.count / maxCount) * 0.75;
        return (
          <span
            key={day.date}
            title={`${day.date}: ${day.count}회 기여`}
            className="h-[14px] w-[14px] rounded-[3px]"
            style={{ backgroundColor: accentColor, opacity }}
          />
        );
      })}
    </div>
  );
}
