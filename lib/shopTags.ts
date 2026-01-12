// lib/shopTags.ts
import type { ServiceTag, SpecialtyTag, Shop } from "@/data/shops/types";

/**
 * Normalize a chunk of text for matching.
 */
function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Regex → tag mappings.
 * These run against a single combined text blob per shop.
 */
const SERVICE_MAP: ReadonlyArray<[RegExp, ServiceTag]> = [
  // general / maintenance
  [/(auto\s*repair|general\s*repair|\brepairs?\b)/i, "general"],
  [/(maintenance|\bservice\b(?!\s*advisor))/i, "maintenance"],
  [/(oil\s*change|oil|lube)/i, "oil_change"],
  [/(diagnostic|diagnostics|scan|code\s*read|check\s*engine)/i, "diagnostics"],

  // systems
  [/brake/i, "brakes"],
  [/(suspension|shock|strut|control\s*arm|ball\s*joint|tie\s*rod)/i, "suspension"],
  [/(align|alignment)/i, "alignment"],
  [/(tire|tires|tyre|tyres|flat|puncture|wheel)/i, "tires"],
  [/(a\/c|air\s*conditioning|hvac|ac\s*service)/i, "ac"],
  [/(engine|misfire|spark|timing)/i, "engine"],
  [/(transmission|gearbox|clutch)/i, "transmission"],
  [/(exhaust|muffler|catalytic)/i, "exhaust"],
  [/(electric|electrical|starter|alternator|battery|wiring)/i, "electrical"],

  // body/collision (be generous here)
  [/(collision|collision\s*repair|crash|body\s*shop|auto\s*body|autobody|body\s*work|bodywork|dent|paint|paintless)/i, "body"],
  [/(collision|collision\s*repair|crash)/i, "collision"],

  // fleets / commercial / heavy
  [/(fleet)/i, "fleet"],
  [/(commercial)/i, "commercial"],
  [/(truck|trucks)/i, "truck"],
  [/(trailer|trailers)/i, "trailer"],

  // specialty
  [/(performance|racing|tune)/i, "performance"],
  [/(restoration|classic)/i, "restoration"],
];

const SPECIALTY_MAP: ReadonlyArray<[RegExp, SpecialtyTag]> = [
  // broad categories
  [/(domestic)/i, "domestic"],
  [/(import)/i, "import"],
  [/(european|euro)/i, "european"],
  [/(asian)/i, "asian"],

  // brands
  [/\bford\b/i, "ford"],
  [/\bgm\b|chev|chevrolet|gmc|buick|cadillac/i, "gm"],
  [/\btoyota\b|lexus/i, "toyota"],
  [/\bhonda\b|acura/i, "honda"],
  [/mercedes|benz|\bmb\b/i, "mercedes"],
  [/\bbmw\b|mini/i, "bmw"],
  [/volkswagen|\bvw\b|\baudi\b/i, "vw_audi"],

  // business types
  [/(fleet)/i, "fleet"],
  [/(commercial)/i, "commercial"],

  // specialty shops
  [/(electrical|electric)/i, "electrical"],
  [/(auto\s*body|body\s*shop|autobody)/i, "body"],
  [/(performance|racing)/i, "performance"],
  [/(restoration|classic)/i, "restoration"],
];

function tagsFromText<TTag extends string>(
  text: string,
  map: ReadonlyArray<[RegExp, TTag]>
): TTag[] {
  const out: TTag[] = [];
  for (const [re, tag] of map) {
    if (re.test(text)) out.push(tag);
  }
  return uniq(out);
}

/**
 * Derive normalized tags from a Shop's content.
 * This approach reduces "Progressive always wins" by giving other shops
 * better detection (e.g., tires/body/collision).
 */
export function deriveTags(shop: Shop): {
  serviceTags: ServiceTag[];
  specialtyTags: SpecialtyTag[];
} {
  const combined = norm(
    [
      shop.name,
      shop.neighborhood,
      shop.description,
      ...(shop.services ?? []),
      ...(shop.specialties ?? []),
    ].join(" | ")
  );

  const serviceTags = tagsFromText(combined, SERVICE_MAP);
  const specialtyTags = tagsFromText(combined, SPECIALTY_MAP);

  // Only default to general if nothing matched
  if (serviceTags.length === 0) serviceTags.push("general");

  return { serviceTags, specialtyTags };
}

/**
 * Optional: use as a tie-breaker signal.
 * Higher means the listing is more specific/complete.
 */
export function shopStrength(shop: Shop): number {
  const s = (shop.services?.length ?? 0) * 2 + (shop.specialties?.length ?? 0);
  const hasDesc = shop.description ? 2 : 0;
  const hasWebsite = shop.website ? 1 : 0;
  const hasPhone = shop.phone ? 1 : 0;
  return s + hasDesc + hasWebsite + hasPhone;
}
