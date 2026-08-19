import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "beenn09";

type ContributionDay = {
  date: string;
  count: number;
};

type LeetCodeGraphQLResponse = {
  data?: {
    matchedUser?: {
      userCalendar?: {
        submissionCalendar: string;
      } | null;
    } | null;
  };
};

// leetcode-api-faisalshohag.vercel.app (a third-party community proxy this
// route used to depend on) had its Vercel deployment deleted, taking the
// widget down with it. Querying LeetCode's own public GraphQL endpoint
// directly removes that single point of failure.
const QUERY = `
  query userProfileCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        submissionCalendar
      }
    }
  }
`;

export async function GET() {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/${LEETCODE_USERNAME}/`,
    },
    body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "LeetCode API 요청에 실패했습니다." }, { status: 502 });
  }

  const payload: LeetCodeGraphQLResponse = await response.json();
  const calendarRaw = payload.data?.matchedUser?.userCalendar?.submissionCalendar;
  if (!calendarRaw) {
    return NextResponse.json({ error: "제출 데이터를 불러오지 못했습니다." }, { status: 502 });
  }
  const calendar: Record<string, number> = JSON.parse(calendarRaw);

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
