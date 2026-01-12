// app/cities/regina-sk/AiShopFinder.tsx
"use client";

import { useMemo, useState } from "react";

type AiResult = {
  slug: string;
  name: string;
  address: string;
  matchScore: number;
};

type AiResponse = {
  parsed?: {
    urgency?: "low" | "medium" | "high";
    drivable?: boolean;
    summary?: string;
    serviceTags?: string[];
    specialtyTags?: string[];
  };
  results?: AiResult[];
  error?: string;
  details?: string;
};

export default function AiShopFinder() {
  const [issueText, setIssueText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => issueText.trim().length > 0 && !loading, [issueText, loading]);

  async function onSearch() {
    if (!issueText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/ai-shop-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueText }),
      });

      // Safer than res.json() when server returns non-JSON
      const text = await res.text();
      let json: AiResponse | null = null;

      try {
        json = text ? (JSON.parse(text) as AiResponse) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.details ||
          (text ? `Request failed (${res.status}): ${text}` : `Request failed (${res.status})`);
        throw new Error(msg);
      }

      if (!json) throw new Error("Server returned an empty response.");
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const urgency = data?.parsed?.urgency;
  const drivable = data?.parsed?.drivable;

  const badge = useMemo(() => {
    if (!urgency) return null;

    const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border";
    if (urgency === "high" || drivable === false) {
      return { text: "High urgency • Not drivable", className: `${base} border-red-200 bg-red-50 text-red-700` };
    }
    if (urgency === "medium") {
      return { text: "Medium urgency", className: `${base} border-amber-200 bg-amber-50 text-amber-800` };
    }
    return { text: "Low urgency", className: `${base} border-emerald-200 bg-emerald-50 text-emerald-800` };
  }, [urgency, drivable]);

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">AI Shop Finder</h2>
          {badge ? <span className={badge.className}>{badge.text}</span> : null}
        </div>

        <p className="text-sm text-gray-600">
          Describe your issue and we’ll suggest the best-fit shops in Regina.
        </p>
        <p className="text-xs text-gray-500">
          Examples: “flat tire”, “brakes squeaking”, “check engine light”, “body work after minor accident”
        </p>
      </div>

      <div className="mt-4">
        <textarea
          rows={4}
          placeholder="Example: grinding noise when braking, car pulls to the right..."
          value={issueText}
          onChange={(e) => setIssueText(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={onSearch}
            disabled={!canSearch}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-6 py-3 text-base font-semibold
              text-white
              bg-blue-600 hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              shadow-md hover:shadow-lg
              transition-all
            "
          >
            🔍 {loading ? "Finding shops…" : "Find best-fit shops"}
          </button>

          {!issueText.trim() ? (
            <span className="text-xs text-gray-500">Type a short description to enable search.</span>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {data?.parsed?.summary ? (
        <div className="mt-4 rounded-xl border bg-gray-50 px-4 py-3">
          <div className="text-sm font-semibold text-gray-900">Summary</div>
          <div className="mt-1 text-sm text-gray-700">{data.parsed.summary}</div>

          {(data.parsed.serviceTags?.length || data.parsed.specialtyTags?.length) ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {(data.parsed.serviceTags ?? []).map((t) => (
                <span key={`svc-${t}`} className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                  {t}
                </span>
              ))}
              {(data.parsed.specialtyTags ?? []).map((t) => (
                <span key={`sp-${t}`} className="rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {data?.results?.length ? (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <strong className="text-sm">Top matches</strong>
            <span className="text-xs text-gray-500">Ranked by tag match</span>
          </div>

          <ul className="mt-3 space-y-3">
            {data.results.map((s) => (
              <li key={s.slug} className="rounded-xl border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="mt-1 text-sm text-gray-700">{s.address}</div>
                    <div className="mt-1 text-xs text-gray-500">Match score: {s.matchScore}</div>
                  </div>

                  <a
                    href={`/regina-sk/shops/${s.slug}`}
                    className="shrink-0 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    View
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
