import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";

export default function ResumeContent() {
  return (
    <div>
      <Image
        src="/Resume.jpg"
        alt="Resume"
        width={595}
        height={842}
        unoptimized
        className="h-auto w-full rounded-lg border border-border"
      />
      <div className="mt-6 rounded-2xl px-6 py-8 text-center">
        <p className="text-2xl font-bold">Photo</p>
        <p className="mt-2 text-sm text-muted">
          {profile.name} · {profile.role}
        </p>
        <a
          href="/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 font-mono-label text-xs font-semibold underline underline-offset-4"
        >
          open_pdf
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
