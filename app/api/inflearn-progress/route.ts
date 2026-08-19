import { NextResponse } from "next/server";

type InflearnCourse = {
  title: string;
  slug: string;
  progress: number;
  completeCount: number;
  lectureCount: number;
  thumbnailUrl: string;
};

type VouchersResponse = {
  data?: {
    items?: {
      progress: string;
      completeCount: number;
      course: {
        title: string;
        slug: string;
        lectureCount: number;
        thumbnailUrl: string;
      };
    }[];
  };
};

const MAX_COURSES = 3;

export async function GET() {
  const cookie = process.env.INFLEARN_COOKIE;
  if (!cookie) {
    return NextResponse.json(
      { error: "INFLEARN_COOKIE이 서버 환경변수에 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const url =
    "https://course-api.inflearn.com/client/api/v2/vouchers/my" +
    "?courseType=ON&isArchived=false&pageNumber=1&pageSize=20&sort=RECENT_STUDYING&lang=ko";

  const response = await fetch(url, {
    headers: { Cookie: cookie },
    // Matches the widget's 5-minute client-side poll interval — a longer
    // cache here would mean the poll keeps re-serving the same stale data.
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "인프런 API 요청에 실패했습니다. 세션 쿠키가 만료되었을 수 있습니다." },
      { status: 502 },
    );
  }

  const payload: VouchersResponse = await response.json();
  const items = payload.data?.items ?? [];

  const courses: InflearnCourse[] = items
    .map((item) => ({
      title: item.course.title,
      slug: item.course.slug,
      progress: Number(item.progress),
      completeCount: item.completeCount,
      lectureCount: item.course.lectureCount,
      thumbnailUrl: item.course.thumbnailUrl,
    }))
    // "지금 공부 중"이라는 의미에 맞게 완주한 강의는 제외하고, 최근 학습순 상위 몇 개만 노출.
    .filter((course) => course.progress < 100)
    .slice(0, MAX_COURSES);

  return NextResponse.json({ courses });
}
