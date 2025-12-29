import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Configuration (easy to reuse when you add more cities)
 */
const CITY_SLUG = "regina-sk";
const CITY_NAME = "Regina";
const REGION = "SK";
const COUNTRY = "CA";
const SITE_NAME = "FindAMechanic.ca";

type Shop = {
  slug: string;
  name: string;
  address: string; // For MVP it's a single string; we can later split into fields
  phone?: string;
  website?: string;
  services: string[];
  specialties: string[];
  description?: string;
};

/**
 * Data (MVP)
 * Later we can move this to /data/shops/regina.ts and reuse in sitemap, etc.
 */
const SHOPS: Shop[] = [
  {
    slug: "sample-auto-repair",
    name: "Sample Auto Repair",
    address: "123 Example St, Regina, SK",
    phone: "306-555-1234",
    website: "https://example.com",
    services: ["Brakes", "Diagnostics", "Tires"],
    specialties: ["Domestic"],
    description: "General repair and diagnostics in Regina.",
  },
];

/**
 * Helpers
 */
function getShopBySlug(slug: string): Shop | undefined {
  return SHOPS.find((s) => s.slug === slug);
}

function canonicalUrlForShop(slug: string) {
  return `${SITE_URL}/${CITY_SLUG}/shops/${slug}`;
}

function canonicalPathForShop(slug: string) {
  return `/${CITY_SLUG}/shops/${slug}`;
}

function sanitizePhoneForTel(phone: string) {
  // keep digits and plus only
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+1${cleaned}`; // Canada/US default
}

function shopJsonLd(shop: Shop) {
  const pageUrl = canonicalUrlForShop(shop.slug);
  const tel = shop.phone ? sanitizePhoneForTel(shop.phone) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${pageUrl}#business`,
    name: shop.name,
    url: pageUrl,
    telephone: tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address, // MVP: single string
      addressLocality: CITY_NAME,
      addressRegion: REGION,
      addressCountry: COUNTRY,
    },
    areaServed: {
      "@type": "City",
      name: CITY_NAME,
    },
    description: shop.description ?? undefined,
    makesOffer: shop.services?.length
      ? shop.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
        }))
      : undefined,
    keywords: shop.services?.length ? shop.services.join(", ") : undefined,
  };
}

/**
 * SEO / Metadata (dynamic per shop)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const shop = getShopBySlug(slug);
  const canonicalUrl = canonicalUrlForShop(slug);

  if (!shop) {
    return {
      title: `Shop not found | ${SITE_NAME}`,
      description: "Auto repair shop profile not found.",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  const title = `${shop.name} (${CITY_NAME}, ${REGION}) | ${SITE_NAME}`;
  const ogTitle = `${shop.name} (${CITY_NAME}, ${REGION})`;
  const description = `${shop.name} in ${CITY_NAME}, ${REGION}. Services: ${shop.services.join(
    ", "
  )}. Address: ${shop.address}. Call or get directions.`;

  const shortDescription = `${shop.name} in ${CITY_NAME}, ${REGION}. Services: ${shop.services.join(
    ", "
  )}.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: shortDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description: shortDescription,
    },
  };
}

/**
 * Page
 */
export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = getShopBySlug(slug);

  if (!shop) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Shop not found</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Slug: {slug}</p>
        <div style={{ marginTop: 14 }}>
          <Link href="/cities/regina-sk" style={{ textDecoration: "none" }}>
            ← Back to Regina
          </Link>
        </div>
      </main>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    shop.address
  )}`;

  const telHref = shop.phone ? `tel:${sanitizePhoneForTel(shop.phone)}` : null;
  const jsonLd = shopJsonLd(shop);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/cities/regina-sk" style={{ textDecoration: "none" }}>
        ← Back to Regina
      </Link>

      <h1 style={{ fontSize: 34, fontWeight: 900, marginTop: 12 }}>
        {shop.name}
      </h1>

      <div style={{ marginTop: 8, opacity: 0.85 }}>{shop.address}</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        {shop.phone && telHref ? (
          <a
            href={telHref}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              textDecoration: "none",
            }}
          >
            Call: {shop.phone}
          </a>
        ) : null}

        {shop.website ? (
          <a
            href={shop.website}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              textDecoration: "none",
            }}
          >
            Website
          </a>
        ) : null}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          Get directions
        </a>
      </div>

      {shop.description ? (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900 }}>About</h2>
          <p style={{ marginTop: 8, lineHeight: 1.6 }}>{shop.description}</p>
        </section>
      ) : null}

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900 }}>Services</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {shop.services.map((x) => (
            <span
              key={x}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #eee",
              }}
            >
              {x}
            </span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900 }}>Specialties</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {shop.specialties.length ? (
            shop.specialties.map((x) => (
              <span
                key={x}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #eee",
                }}
              >
                {x}
              </span>
            ))
          ) : (
            <span style={{ opacity: 0.7 }}>Not specified</span>
          )}
        </div>
      </section>

      {/* Optional: Debug canonical path (remove later) */}
      {/* <pre style={{ marginTop: 24, opacity: 0.6 }}>{canonicalPathForShop(shop.slug)}</pre> */}
    </main>
  );
}
