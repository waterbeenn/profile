import Image from "next/image";
import { profile } from "@/lib/data";

export default function AboutProfileHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-30 w-30 shrink-0 overflow-hidden rounded-full bg-accent shadow-md">
        <Image
          src="/profile.jpg"
          alt={profile.name}
          fill
          sizes="80px"
          unoptimized
          className="object-cover"
        />
      </div>
      <p className="mt-4 text-2xl font-bold">{profile.name}</p>
      <p className="mt-1 text-sm text-muted">
        {profile.role} · {new Date().getFullYear()}
      </p>
    </div>
  );
}
