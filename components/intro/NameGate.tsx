"use client";

import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import KeyboardScene from "./KeyboardScene";

const TARGET_NAME = "MIN SU BIN";

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

export default function NameGate() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    if (normalize(value) === TARGET_NAME) {
      router.push("/portfolio");
      return;
    }
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-[#111]">
      <h1 className="font-sekuya text-center text-5xl uppercase tracking-tight sm:text-6xl md:text-7xl">
        Type my name
      </h1>

      <div className="aspect-[16/9] w-full max-w-3xl">
        <KeyboardScene />
      </div>

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="MIN SU BIN"
        aria-label="이름을 입력하고 Enter를 누르세요"
        autoComplete="off"
        spellCheck={false}
        className={`w-full max-w-sm rounded-full border border-neutral-300 bg-white px-6 py-3 text-center text-sm tracking-[0.15em] text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500 ${
          shake ? "animate-shake" : ""
        }`}
      />
    </main>
  );
}
