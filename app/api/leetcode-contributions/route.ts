import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "beenn09";

type ContributionDay = {
  date: string;
  count: number;
};

type LeetCodeResponse = {
  submissionCalendar?: Record<string, number>;
};

export async function GET() {
  const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "LeetCode API 요청에 실패했습니다." }, { status: 502 });
  }

  const payload: LeetCodeResponse = await response.json();
  const calendar = payload.submissionCalendar;
  if (!calendar) {
    return NextResponse.json({ error: "제출 데이터를 불러오지 못했습니다." }, { status: 502 });
  }

  // submissionCalendar keys are Unix seconds at UTC midnight of each active day.
  const countByDate = new Map<string, number>();
  for (const [timestamp, count] of Object.entries(calendar)) {
    const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
    countByDate.set(date, count);
  }

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const days: ContributionDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index + 1)).toISOString().slice(0, 10);
    return { date, count: countByDate.get(date) ?? 0 };
  });

  return NextResponse.json({ days });
}
