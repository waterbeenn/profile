import { NextResponse } from "next/server";
import { Resend } from "resend";
import { profile } from "@/lib/data";

type ContactPayload = {
  name?: string;
  email?: string;
  purpose?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// RFC 2047: header fields (From display-name, Subject) are 7-bit ASCII by
// spec, so any non-ASCII text in them has to be wrapped as a MIME
// "encoded-word" (=?UTF-8?B?<base64>?=). Sending raw UTF-8 bytes in a header
// — which is what a plain template string does — is what was producing the
// garbled Hangul in both the subject line and the sender name.
function encodeMimeWord(value: string) {
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY이 서버 환경변수에 설정되어 있지 않습니다." },
      { status: 500 },
    );
  }

  const body: ContactPayload = await request.json();
  const { name, email, purpose, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "이름, 이메일, 메시지는 필수입니다." },
      { status: 400 },
    );
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePurpose = escapeHtml(purpose ?? "기타");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  // A plain-text-only body left charset detection up to each mail client,
  // and some guessed wrong and garbled the Korean text. An HTML body
  // declares its own charset via <meta charset="utf-8">, which every client
  // respects, so that's now the primary body with `text` kept as a fallback.
  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
    <p><strong>보낸 사람:</strong> ${safeName} (${safeEmail})</p>
    <p><strong>목적:</strong> ${safePurpose}</p>
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;">
    <p>${safeMessage}</p>
  </body>
</html>`;

  const { error } = await resend.emails.send({
    // Resend's shared onboarding domain can send to the account owner's own
    // verified address without any custom-domain setup — exactly this case.
    from: `${encodeMimeWord("포트폴리오 문의")} <onboarding@resend.dev>`,
    to: profile.email,
    replyTo: email,
    subject: encodeMimeWord(`[포트폴리오 문의] ${purpose ?? "기타"} · ${name}`),
    html,
    text: `보낸 사람: ${name} (${email})\n목적: ${purpose ?? "기타"}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "메일 전송에 실패했습니다." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
