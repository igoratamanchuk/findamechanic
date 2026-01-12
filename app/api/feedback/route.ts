// app/api/feedback/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeString(v: unknown) {
  return String(v ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c] ?? c;
  });
}

async function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  // ✅ Import only when needed (prevents build-time crash)
  const { Resend } = await import("resend");
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = safeString(body.name);
    const email = safeString(body.email);
    const message = safeString(body.message);

    // Email REQUIRED + validated
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const resend = await getResend();
    if (!resend) {
      // In dev, don’t crash—return clear signal
      console.log("FEEDBACK RECEIVED (missing RESEND_API_KEY):", { name, email, message });
      return NextResponse.json(
        { ok: false, delivered: false, error: "RESEND_API_KEY not set" },
        { status: 500 }
      );
    }

    const to = "findamechanic.info@gmail.com";
    const from = process.env.FEEDBACK_FROM_EMAIL || "FindAMechanic <onboarding@resend.dev>";
    const subject = `FindAMechanic Feedback${name ? ` — ${name}` : ""}`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Arial;line-height:1.5">
        <h2 style="margin:0 0 12px">New feedback received</h2>
        <p style="margin:0 0 6px"><strong>Name:</strong> ${escapeHtml(name || "(not provided)")}</p>
        <p style="margin:0 0 6px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:12px 0 6px"><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f6f7f9;border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:0">${escapeHtml(
          message
        )}</pre>
        <p style="color:#6b7280;font-size:12px;margin-top:12px">
          Sent from FindAMechanic feedback form
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: name ? `${name} <${email}>` : email, // ✅ always valid format
    });

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return NextResponse.json(
        { ok: false, delivered: false, error: result.error.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true, id: result.data?.id ?? null });
  } catch (err: any) {
    console.error("FEEDBACK ERROR:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback.", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
