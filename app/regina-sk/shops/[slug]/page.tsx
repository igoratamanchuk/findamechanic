import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { REGINA_CITY, REGINA_SHOPS, getReginaShopBySlug } from "@/data/shops/regina";

const SITE_NAME = "FindAMechanic.ca";

function canonicalUrlForShop(slug: string) {
  return `${SITE_URL}/${REGINA_CITY.slug}/shops/${slug}`;
}

function sanitizePhoneForTel(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+1${cleaned}`;
}

function shopJsonLd(shop: (typeof REGINA_SHOPS)[number]) {
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
      streetAddress: shop.address,
      addressLocality: REGINA_CITY.name,
      addressRegion: REGINA_CITY.region,
      addressCountry: REGINA_CITY.country,
    },
    areaServed: {
      "@type": "City",
      name: REGINA_CITY.name,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const shop = getReginaShopBySlug(slug);
  const canonicalUrl = canonicalUrlForShop(slug);

  if (!shop) {
    return {
      title: `Shop not found | ${SITE_NAME}`,
      description: "Auto repair shop profile not found.",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  const title = `${shop.name} (${REGINA_CITY.name}, ${REGINA_CITY.region}) | ${SITE_NAME}`;
  const ogTitle = `${shop.name} (${REGINA_CITY.name}, ${REGINA_CITY.region})`;
  const description = `${shop.name} in ${REGINA_CITY.name}, ${REGINA_CITY.region}. Services: ${shop.services.join(
    ", "
  )}. Address: ${shop.address}. Call or get directions.`;
  const shortDescription = `${shop.name} in ${REGINA_CITY.name}, ${REGINA_CITY.region}. Services: ${shop.services.join(
    ", "
  )}.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
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

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = getReginaShopBySlug(slug);

  if (!shop) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Shop not found</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Slug: {slug}</p>
        <div style={{ marginTop: 14 }}>
          <Link href={`/cities/${REGINA_CITY.slug}`} style={{ textDecoration: "none" }}>
            ← Back to {REGINA_CITY.name}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href={`/cities/${REGINA_CITY.slug}`} style={{ textDecoration: "none" }}>
        ← Back to {REGINA_CITY.name}
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
    </main>
  );
}
