# profile

**데스크톱 UI로 구현한 개인 포트폴리오**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [API Reference](#api-reference)
- [겪었던 문제와 해결](#겪었던-문제와-해결)
- [실행 방법](#실행-방법)
- [환경 변수](#환경-변수)
- [Credit](#credit)

## 프로젝트 소개

일반적인 스크롤형 포트폴리오 대신, **직접 조작해볼 수 있는 macOS 스타일 데스크톱**으로 자기소개·이력·프로젝트·연락처를 담은 개인 포트폴리오입니다.

방문자는 이름을 입력해야 열리는 인트로를 통과해 데스크톱에 진입하고, 아이콘을 눌러 창을 열고, 독(Dock)에서 아이콘을 드래그로 재배열하고, 테마를 바꾸는 식으로 사이트 자체를 "가지고 놀며" 정보를 확인하게 됩니다.

## 주요 기능

- **3D 키보드 인트로** — Three.js로 직접 모델링한 키보드가 실제 키 입력에 반응해 키캡이 눌리며, 지정된 이름을 입력해야 데스크톱으로 진입할 수 있습니다.
- **macOS 스타일 데스크톱 UI** — 메뉴바(실시간 시계, 소셜 링크), 데스크톱 아이콘, 창(About / Resume / Projects / Contact)으로 구성된 화면.
- **드래그 가능한 Dock** — 마우스 근접도에 따라 아이콘이 부드럽게 확대되는 macOS식 매그니피케이션 효과, 드래그로 순서 변경(순서는 `localStorage`에 저장).
- **4가지 데스크톱 테마** — Sky / Blossom / Meadow / Dark, CSS 커스텀 프로퍼티로 배경·유리 패널·텍스트 색상을 한 번에 스왑.
- **실시간 위젯 패널** — 서울 날씨, Inflearn 학습 현황(진행 중인 강의 · 이번 달 학습 잔디), GitHub·LeetCode 컨트리뷰션 잔디를 표시.
- **문의 폼** — Resend로 실제 이메일이 발송되며, 한글 제목/발신자명이 깨지지 않도록 MIME 인코딩 처리.
- **프로젝트 상세 창** — 실제로 진행한 4개 프로젝트(국내 급등주 대시보드, VIVIZIP, Hompany, gooseduck)의 소개, 기술 스택, 링크를 확인 가능.

## 기술 스택

| 영역      | 사용 기술               |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| UI        | React 19, TypeScript 5  |
| Styling   | Tailwind CSS 4          |
| 3D        | Three.js                |
| Icons     | lucide-react            |
| Email     | Resend                  |

## API Reference

| Method | Endpoint                      | 설명                                                                | 필요 환경 변수    |
| ------ | ----------------------------- | ------------------------------------------------------------------- | ----------------- |
| GET    | `/api/weather`                | Open-Meteo에서 서울 현재 기온·체감온도·날씨 상태 조회 (30분 캐시)   | -                 |
| GET    | `/api/github-contributions`   | GitHub GraphQL API로 이번 달 컨트리뷰션 캘린더 조회 (1시간 캐시)    | `GITHUB_TOKEN`    |
| GET    | `/api/leetcode-contributions` | LeetCode 제출 기록을 이번 달 기준 일별 카운트로 재구성 (1시간 캐시) | -                 |
| GET    | `/api/inflearn-progress`      | 진행 중인 Inflearn 강의 최대 3개 조회 (5분 캐시)                    | `INFLEARN_COOKIE` |
| GET    | `/api/inflearn-monthly`       | 이번 달 학습 잔디 + 연간 누적 학습 통계 조회 (5분 캐시)             | `INFLEARN_COOKIE` |
| POST   | `/api/contact`                | 문의 폼 데이터를 받아 Resend로 이메일 발송                          | `RESEND_API_KEY`  |

## 겪었던 문제와 해결

- **폰트가 적용되지 않던 문제**: 한글 폰트를 적용했는데 크기만 비슷하게 맞춘 대체 폰트(Arial)가 대신 쓰이고 있어 모노 폰트로 쓴 글자들이 원래보다 35%나 크게 나오고 있었습니다. Google Fonts 스타일시트를 직접 연결하는 방식으로 바꿔서 해결했습니다.
- **Dock 아이콘이 깜빡이던 문제**: 마우스가 다가오면 아이콘이 커지는 효과를 만들었는데, 커서가 멀리 있을 때도 계속 아이콘 위치를 다시 계산하고 있어서 다른 아아콘까지 같이 깜빡이고 있었습니다. 그래서 아이콘들이 다 멈춰 있는 상태라면 그 프레임에서는 위치 계산 자체를 건너뛰도록 바꿔서 해결했습니다.
- **문의 메일의 한글 깨짐**: 메일 제목과 보낸 사람 이름에 한글을 그대로 넣었더니 일부 메일 프로그램에서 글자가 깨져 보였습니다. 한글이 포함된 부분을 메일 표준 인코딩 형식으로 감싸고, 본문도 한글이 깨지지 않는 형식을 우선으로 쓰도록 고쳤습니다.
- **인프런 위젯이 갱신 안 되던 문제**: 처음 접속했을 때 딱 한 번만 데이터를 불러오고 그 뒤로는 새로 공부한 내용이 반영되지 않았습니다. 5분마다 새로 데이터를 불러오도록 바꿔서 최신 상태가 보이게 했습니다.

## 실행 방법

```bash
git clone https://github.com/waterbeenn/profile.git
cd profile
npm install
npm run dev
```

이후 [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 환경 변수

루트에 `.env.local` 파일을 만들고 아래 값을 채워주세요. (값이 없어도 실행은 되며, 해당 위젯/기능만 오류 상태로 표시됩니다.)

```env
RESEND_API_KEY=      # 문의 폼 이메일 발송용 (resend.com)
GITHUB_TOKEN=        # GitHub 컨트리뷰션 잔디 조회용 (read:user 권한)
INFLEARN_COOKIE=     # Inflearn 학습 현황 위젯용 세션 쿠키
```

## Credit

**민수빈** — 기획, 디자인, 프론트엔드 개발 전체를 단독으로 진행했습니다.
