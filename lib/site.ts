function normalizeBaseUrl(url: string) {
  // Remove trailing slash
  return url.replace(/\/+$/, "");
}

// Priority:
// 1) NEXT_PUBLIC_SITE_URL (you set it locally + in Vercel)
// 2) VERCEL_URL (auto provided by Vercel, no protocol)
// 3) localhost fallback
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000";

export const SITE_URL = normalizeBaseUrl(fromEnv);

// Helper to build absolute URLs everywhere
export function absUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}
