import { NextResponse } from "next/server";

type ContributionDay = {
  date: string;
  count: number;
};

type LearningStats = {
  completedUnitCount: number;
  completedCourseCount: number;
  noteCount: number;
  learningTimeLabel: string;
};

type AnnualLearningResponse = {
  data?: {
    heatMap?: [string, number][];
    completedUnitCount?: number;
    completedCourseCount?: number;
    noteCount?: number;
    learningTime?: { days: number; hours: number; minutes: number };
  };
};

function formatLearningTime(time?: { days: number; hours: number; minutes: number }) {
  if (!time) return "0분";
  const parts: string[] = [];
  if (time.days > 0) parts.push(`${time.days}일`);
  if (time.hours > 0) parts.push(`${time.hours}시간`);
  if (parts.length === 0 || time.minutes > 0) parts.push(`${time.minutes}분`);
  return parts.join(" ");
}

export async function GET() {
  const cookie = process.env.INFLEARN_COOKIE;
  if (!cookie) {
    return NextResponse.json(
      { error: "INFLEARN_COOKIE이 서버 환경변수에 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const now = new Date();
  const year = now.getFullYear();
  const url =
    "https://account-api.inflearn.com/client/api/v2/dashboard/annual-learning" +
    `?timezone=Asia%2FSeoul&year=${year}&lang=ko`;

  const response = await fetch(url, {
    headers: { Cookie: cookie },
    // Matches the widget's 5-minute client-side poll interval — see the
    // same note in inflearn-progress/route.ts.
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "인프런 API 요청에 실패했습니다. 세션 쿠키가 만료되었을 수 있습니다." },
      { status: 502 },
    );
  }

  const payload: AnnualLearningResponse = await response.json();
  const heatMap = payload.data?.heatMap ?? [];

  const monthPrefix = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const days: ContributionDay[] = heatMap
    .filter(([date]) => date.startsWith(monthPrefix))
    .map(([date, count]) => ({ date, count }));

  // These four counts are annual totals straight from Inflearn's own "연간
  // 학습" summary row, not scoped to the current month like `days` above.
  const stats: LearningStats = {
    completedUnitCount: payload.data?.completedUnitCount ?? 0,
    completedCourseCount: payload.data?.completedCourseCount ?? 0,
    noteCount: payload.data?.noteCount ?? 0,
    learningTimeLabel: formatLearningTime(payload.data?.learningTime),
  };

  return NextResponse.json({ days, stats });
}
