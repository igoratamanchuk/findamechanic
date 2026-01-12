// app/api/ai-shop-search/route.ts
import { NextResponse } from "next/server";

import { REGINA_SHOPS } from "@/data/shops/regina";
import { deriveTags } from "@/lib/shopTags";
import type { ServiceTag, SpecialtyTag } from "@/data/shops/types";

export const runtime = "nodejs";

const ALLOWED_SERVICE_TAGS: readonly ServiceTag[] = [
  "general",
  "maintenance",
  "oil_change",
  "diagnostics",
  "brakes",
  "suspension",
  "alignment",
  "tires",
  "ac",
  "engine",
  "transmission",
  "exhaust",
  "electrical",
  "body",
  "collision",
  "fleet",
  "commercial",
  "performance",
  "restoration",
  "truck",
  "trailer",
];

const ALLOWED_SPECIALTY_TAGS: readonly SpecialtyTag[] = [
  "domestic",
  "import",
  "european",
  "asian",
  "ford",
  "gm",
  "toyota",
  "honda",
  "mercedes",
  "bmw",
  "vw_audi",
  "fleet",
  "commercial",
  "electrical",
  "body",
  "performance",
  "restoration",
];

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function sanitizeTags<T extends string>(tags: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(tags)) return [];
  const set = new Set(allowed);
  return uniq(tags.filter((t) => typeof t === "string" && set.has(t as T)) as T[]);
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

type IssueParse = {
  urgency: "low" | "medium" | "high";
  drivable: boolean;
  serviceTags: ServiceTag[];
  specialtyTags: SpecialtyTag[];
  summary: string;
};

async function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;

  // 🔍 DEBUG: env visibility
  console.log("DEBUG: OPENAI_API_KEY present =", Boolean(key));
  console.log("DEBUG: VERCEL_ENV =", process.env.VERCEL_ENV);
  console.log("DEBUG: COMMIT =", process.env.VERCEL_GIT_COMMIT_SHA);

  if (!key) return null;

  try {
    const OpenAI = (await import("openai")).default;
    return new OpenAI({ apiKey: key });
  } catch (err: any) {
    console.error("DEBUG: FAILED TO IMPORT OPENAI:", err?.message ?? err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const issueText = String(body.issueText ?? "");
    const make = String(body.make ?? "");
    const model = String(body.model ?? "");
    const year = String(body.year ?? "");

    if (!issueText.trim()) {
      return NextResponse.json({ error: "issueText is required" }, { status: 400 });
    }

    const client = await getOpenAIClient();

    // 🔴 EARLY DEBUG EXIT
    if (!client) {
      return NextResponse.json(
        {
          error: "AI client not available",
          debug: {
            hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
            vercelEnv: process.env.VERCEL_ENV ?? null,
            commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
          },
        },
        { status: 500 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an auto repair routing assistant. Return ONLY JSON that matches the schema. " +
            "Choose serviceTags and specialtyTags ONLY from the enums in the schema. " +
            "If unsafe (brake failure, overheating, smoke, fuel smell), set urgency=high and drivable=false.",
        },
        {
          role: "user",
          content: `Vehicle: ${year} ${make} ${model}\nIssue: ${issueText}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "issue_parse",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              urgency: { type: "string", enum: ["low", "medium", "high"] },
              drivable: { type: "boolean" },
              serviceTags: {
                type: "array",
                items: { type: "string", enum: ALLOWED_SERVICE_TAGS as unknown as string[] },
              },
              specialtyTags: {
                type: "array",
                items: { type: "string", enum: ALLOWED_SPECIALTY_TAGS as unknown as string[] },
              },
              summary: { type: "string" },
            },
            required: ["urgency", "drivable", "serviceTags", "specialtyTags", "summary"],
          },
        },
      },
    });

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    const parsed = safeJsonParse(raw);

    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw },
        { status: 500 }
      );
    }

    const serviceTags = sanitizeTags<ServiceTag>(parsed.serviceTags, ALLOWED_SERVICE_TAGS);
    const specialtyTags = sanitizeTags<SpecialtyTag>(
      parsed.specialtyTags,
      ALLOWED_SPECIALTY_TAGS
    );

    const normalized: IssueParse = {
      urgency: parsed.urgency ?? "medium",
      drivable: Boolean(parsed.drivable),
      serviceTags,
      specialtyTags,
      summary: String(parsed.summary ?? ""),
    };

    const scored = REGINA_SHOPS.map((shop) => {
      const { serviceTags: sTags, specialtyTags: spTags } = deriveTags(shop);

      let score = 0;
      for (const t of serviceTags) if (sTags.includes(t)) score += 5;
      for (const t of specialtyTags) if (spTags.includes(t)) score += 3;

      return { shop, score };
    }).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      parsed: normalized,
      results: scored.slice(0, 5).map(({ shop, score }) => ({
        ...shop,
        matchScore: score,
      })),
    });
  } catch (err: any) {
    console.error("AI SHOP SEARCH ERROR:", err);
    return NextResponse.json(
      { error: "AI search failed", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
