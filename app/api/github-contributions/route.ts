import { NextResponse } from "next/server";

const GITHUB_USERNAME = "waterbeenn";

type ContributionDay = {
  date: string;
  count: number;
};

type GraphQLResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN이 서버 환경변수에 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59)).toISOString();

  const query = `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME, from, to } }),
    // Contribution counts don't change fast enough to need per-request freshness.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "GitHub API 요청에 실패했습니다." }, { status: 502 });
  }

  const payload: GraphQLResponse = await response.json();
  const calendar = payload.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    return NextResponse.json(
      { error: payload.errors?.[0]?.message ?? "기여 데이터를 불러오지 못했습니다." },
      { status: 502 },
    );
  }

  const days: ContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({ date: day.date, count: day.contributionCount }));

  return NextResponse.json({ days });
}
