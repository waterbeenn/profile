export const profile = {
  name: "민수빈",
  role: "Frontend Developer",
  shortBio:
    "프론트엔드 개발이 단순히 화면을 구현하는 일이 아닌, 컴포넌트 사이에서 데이터와 상태가 자연스럽게 흐르도록 설계하는 과정이라 생각합니다.\n그 흐름 위에서 안정적이고 부드러운 사용자 경험을 만듭니다.",
  longBio:
    "사용자가 서비스를 처음 만나는 지점을 설계하는 만큼, 방문부터 다음 행동까지의 여정이 끊김없이 이어지도록 만드는 것을 중요하게 생각합니다.\n\n이를위해 인터랙션을 얹기 전에 컴포넌트 구조와 상태 흐름부터 설계해, 사용자가 다음 행동을 망설이지 않도록 합니다. '화면 전환 속도, 반응 시간, 필요한 정보에 닿기까지의 거리' 이 세 가지를 기준으로 화면을 설계합니다.\n\n개인적으로  로딩 시간이 오래걸리거나, 데이터를 받아오는 과정에서 버벅거리는 현상을 싫어해 최적화에 힘을 쓰는 편입니다.\n\n개인 프로젝트 3개, 팀프로젝트 1개를 진행하였으며 작업물은 Project에서 확인할 수 있습니다.",
  email: "kkomadragon@gmail.com",
  social: {
    github: "github.com/waterbeenn",
    linkedin: "www.linkedin.com/in/subin-min-baa3151b6",
    instagram: "www.instagram.com/binnn120",
  },
} as const;

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
  summary: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    slug: "geupdeung",
    title: "국내 급등주 대시보드",
    description:
      "국내 급등주 TOP100 시세와 경제뉴스를 한 화면에서 확인할 수 있는 SPA입니다.",
    tags: [
      "React",
      "javascript",
      "typescript",
      "Express",
      "Vercel",
      "Render",
      "API",
    ],
    link: "https://geupdeung.vercel.app/",
    github: "https://github.com/waterbeenn/geupdeung",
    summary: `• 급등 종목을 확인해도 상승 이유를 파악하려면 종목명을 일일이 검색해야 하는 번거로움을 해결하기 위해 개발
• React 프론트엔드와 Express API 서버를 분리한 구조로 데이터 흐름 설계, Axios 기반 비동기 통신 구현
• Lighthouse로 초기 번들 병목을 진단하고 조건부 렌더링의 한계를 확인한 뒤, React.lazy+Suspense 기반 라우트 분리 로드로 전환해 Performance 점수를 홈 78→100점, TOP100 79→100점, 뉴스 80→94점으로 개선
• express-rate-limit(IP당 15분 200회 제한), helmet 보안 헤더 적용으로 반복 API 호출 및 웹 취약점 노출 방어`,
    gradient: "from-orange-200 via-amber-100 to-white",
  },
  {
    slug: "vivizip",
    title: "VIVIZIP(신한 스퀘어브릿지 청년 해커톤)",
    description:
      "유학생·1인 가구를 위한 AI 서류 검토 기반 부동산 계약 지원 앱입니다.",
    tags: [
      "React Native",
      "Expo",
      "Typescript",
      "Tailwind (NativeWind)",
      "Zustand",
    ],
    link: "https://www.youtube.com/shorts/WxynvALhA4s",
    github: "https://github.com/vivizip/vivizip_FrontEnd",
    summary: `• 유학생이 등기부등본·계약서 같은 법률 서류를 스스로 해석하지 못해 전세 사기 등 위험에 노출되는 문제를 해결하기 위해 개발
• 서류 촬영 시 AI가 위험 요소를 짚어주는 검토 기능과, 계약 전·중·후 3단계 체크리스트 UI 구현
• 계약 전·중·후 공통 서류 화면을 컴포넌트화해 다양한 서류 데이터 구조를 재사용 가능하도록 설계
• 여러 탭·스택 네비게이션에서 공유되는 상태를 Zustand 스토어 분리로 관리
• 401 응답이 동시에 여러 번 발생할 때 토큰 재발급 API가 중복 호출되는 문제를 Promise 공유 방식으로 해결하고, 재발급 실패 시 세션 정리 후 로그인 화면으로 전환되는 인증 플로우 구현`,
    gradient: "from-violet-200 via-purple-100 to-white",
  },
  {
    slug: "hompany",
    title: "Hompany",
    description:
      "집 주소와 채용공고 링크만 입력하면 회사까지의 통근 거리와 대중교통 경로를 자동으로 계산해주는 서비스입니다.",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "cheerio",
      "Kakao Maps API",
      "ODsay API",
      "Vercel",
    ],
    link: "https://hompany.vercel.app/",
    github: "https://github.com/waterbeenn/hompany",
    summary: `• 채용 공고 여러 곳에 지원할 때마다 회사 위치를 일일이 검색해 통근 거리를 가늠하는 것이 번거로워 개발
• Next.js App Router로 프론트·백엔드 통합, 스크래핑·외부 API 키 로직은 서버 사이드로 분리
• 카카오 지오코딩·ODsay 대중교통 API를 연동해 최단 시간 경로·소요시간·이동수단 계산, 카카오맵 SDK로 경로 시각화
• '최단 거리'와 '최단 시간' 개념 혼용으로 발생한 지도-경로 데이터 불일치 버그를 발견해 수정`,
    gradient: "from-sky-200 via-blue-100 to-white",
  },
  {
    slug: "gooseduck",
    title: "gooseduck",
    description:
      "개발하며 겪은 문제와 해결 과정을 기록하는 개인 기술 블로그입니다.",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Velite",
      "Auth.js",
      "GitHub API",
      "Vercel",
    ],
    link: "https://gooseduck-blog.vercel.app/",
    github: "https://github.com/waterbeenn/gooseduck-blog",
    summary: `• 글을 마크다운 파일로 직접 관리하는 게 번거로워, GitHub OAuth로 소유자만 인증하고 별도 fine-grained PAT로 GitHub Contents API에 커밋하는 방식의 글 작성·수정·삭제 관리자 페이지 구현
• Velite 기반 MDX 콘텐츠 파이프라인으로 정적 블로그를 구축하고, 외부 API 호출은 서버 라우트로 프록시해 CSP connect-src 'self'를 유지
• canvas 마스크 판정과 CSS transition 기반 위치 보간으로 인터랙티브 홈 화면 구현
• URL 디코딩된 slug를 검증 없이 파일 경로에 그대로 사용해, '..%2F..%2Fsecret'와 같은 값으로 저장소 내 다른 파일까지 삭제될 수 있는 취약점 발견 후, 허용 문자를 제한하는 화이트리스트 정규식 검증 적용`,
    gradient: "from-emerald-200 via-teal-100 to-white",
  },
];

export const techSkillMax = 5;

export type TechSkill = { name: string; score: number };

export const techSkills: TechSkill[] = [
  { name: "React", score: 4.5 },
  { name: "JavaScript", score: 4 },
  { name: "TypeScript", score: 4 },
  { name: "Next.js", score: 3 },
  { name: "AI", score: 4.5 },
];

export const contactPurposes = [
  "채용 제안",
  "프로젝트 문의",
  "커피챗",
  "기타",
] as const;
