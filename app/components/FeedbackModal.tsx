"use client";

import { useEffect, useMemo, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function FeedbackModalButton() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const emailOk = useMemo(() => isValidEmail(email), [email]);

  const canSubmit = useMemo(() => {
    return message.trim().length >= 10 && emailOk && state !== "submitting";
  }, [message, emailOk, state]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function onSubmit() {
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!emailOk) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters.");
      return;
    }

    setState("submitting");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        throw new Error(json?.details || json?.error || `Submit failed (${res.status})`);
      }

      setState("success");
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => {
        setOpen(false);
        setState("idle");
      }, 1200);
    } catch (e: any) {
      setState("error");
      setError(e?.message || "Something went wrong");
    }
  }

  return (
    <>
      {/* ✅ Smaller + non-overlapping:
          - Mobile: bottom-right
          - Desktop: top-right (sm+)
      */}
      <div className="fixed right-3 bottom-3 z-[60] sm:top-4 sm:bottom-auto">
        <button
          onClick={() => setOpen(true)}
          className="
            inline-flex items-center justify-center
            rounded-full sm:rounded-xl
            px-3 py-2 sm:px-5 sm:py-2.5
            text-xs sm:text-sm
            font-semibold
            text-white
            bg-blue-600 hover:bg-blue-700
            shadow-md transition
          "
        >
          Contact Site Admin
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b p-5">
                <div>
                  <h3 className="text-lg font-bold">Send feedback</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Report an incorrect listing, suggest a shop, or share an idea.
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Name (optional)
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="you@email.com"
                      inputMode="email"
                      autoComplete="email"
                    />
                    {!emailOk && email.trim().length > 0 ? (
                      <div className="mt-1 text-xs text-red-600">
                        Please enter a valid email.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={5}
                    placeholder="Example: 'This shop is closed' or 'Add a filter for tires'..."
                  />
                  <div className="mt-1 text-xs text-gray-500">Minimum 10 characters.</div>
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {state === "success" ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Thanks! Your feedback was sent.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-3 border-t p-5">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="
                    inline-flex items-center justify-center
                    rounded-xl px-5 py-2.5 text-sm font-semibold
                    text-white bg-blue-600 hover:bg-blue-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-sm transition
                  "
                >
                  {state === "submitting" ? "Sending…" : "Send feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
