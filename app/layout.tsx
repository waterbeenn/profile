import type { Metadata } from "next";
import { profile } from "@/lib/data";
import "./globals.css";

// Every webfont here is linked directly rather than going through
// next/font/google. In this project next/font emitted no real @font-face at
// all — for either family — leaving only its metric-fallback faces, which are
// just local Arial with a size-adjust applied (134.59% for Geist Mono, 104.76%
// for Noto Sans KR). So nothing rendered in the intended typeface, and the
// mono labels in particular drew ~35% larger than their declared font-size.
//
// Linking the stylesheets keeps every slice with its unicode-range intact, so
// the browser downloads only the ranges it needs — including the Korean
// slices, which Google serves unnamed and next/font's subset filter drops.
// --font-sans and --font-mono are defined in globals.css to match.

export const metadata: Metadata = {
  title: `${profile.name} — Frontend Developer`,
  description: `구조를 먼저 그리고, 그 위에 흐름을 얹는 프론트엔드 개발자 ${profile.name}의 인터랙티브 포트폴리오 (목업 데이터).`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <head>
        {/* See the note above for why these are linked rather than loaded via
            next/font. This is the App Router root layout (not a Pages Router page),
            so the link is already site-wide — the no-page-custom-font rule below
            is a false positive. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Geist+Mono:wght@400;500&family=Sekuya&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
