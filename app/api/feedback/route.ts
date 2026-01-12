import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  const { Resend } = await import("resend"); // ✅ import only at runtime
  return new Resend(key);
}

export async function POST(req: Request) {
  const resend = await getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Feedback email is not configured." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const to = process.env.FEEDBACK_TO_EMAIL || "findamechanic.info@gmail.com";
  const from = process.env.FEEDBACK_FROM_EMAIL;
  if (!from) {
    return NextResponse.json(
      { error: "Sender email is not configured." },
      { status: 500 }
    );
  }

  await resend.emails.send({
    to,
    from,
    subject: `FindAMechanic Feedback${name ? ` — ${name}` : ""}`,
    text: `Name: ${name || "(not provided)"}\nEmail: ${email}\n\n${message}\n`,
    replyTo: email,
  });

  return NextResponse.json({ ok: true });
}
