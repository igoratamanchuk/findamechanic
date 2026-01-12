import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "FindAMechanic <feedback@findamechanic.ca>",
      to: "findamechanic.info@gmail.com",
      replyTo: email,
      subject: "New FindAMechanic Feedback",
      html: `
        <h2>New feedback received</h2>
        <p><strong>Name:</strong> ${name || "(not provided)"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <pre>${message}</pre>
      `,
    });

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return NextResponse.json(
        { error: "Email delivery failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("FEEDBACK ERROR:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
