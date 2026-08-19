"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { contactPurposes } from "@/lib/data";

export default function ContactContent() {
  const [purpose, setPurpose] = useState<string>(contactPurposes[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, purpose, message }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-accent bg-accent-soft px-5 py-6">
        <Check className="text-accent" size={20} />
        <p className="text-sm font-medium">
          메시지가 전송됐습니다. 확인 후 빠르게 답장드릴게요!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold leading-snug">
        함께, 더 좋은 경험을 만들어가고 싶습니다.
      </h2>
      <p className="mt-3 text-sm text-muted">
        작은 제안이나 질문도 편하게 남겨주세요. 확인 후 빠르게 답장드릴게요.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold">Name</label>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력해주세요."
              className="mt-2 w-full border-b border-border bg-transparent py-1.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs font-bold">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="답장을 받을 이메일을 입력해주세요."
              className="mt-2 w-full border-b border-border bg-transparent py-1.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold">Purpose</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {contactPurposes.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setPurpose(item)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  purpose === item
                    ? "border-accent bg-accent text-background"
                    : "border-border text-muted hover:border-foreground/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold">Message</label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="함께 나누고 싶은 이야기를 자유롭게 적어주세요."
            className="mt-2 w-full field-sizing-content py-2.5 resize-none border-b border-border bg-transparent text-sm outline-none placeholder:text-muted/60 focus:border-accent"
          />
        </div>

        {status === "error" && (
          <p className="text-xs font-medium text-red-500">
            전송에 실패했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "전송 중..." : "Submit"}
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
