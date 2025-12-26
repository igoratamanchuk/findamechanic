import Link from "next/link";

type Shop = {
  slug: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  services: string[];
  specialties: string[];
  description?: string;
};

import type { Metadata } from "next";


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
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shop = SHOPS.find((s) => s.slug === slug);

  if (!shop) {
    return {
      title: "Shop not found",
      description: "Auto repair shop profile not found.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${shop.name} (Regina, SK)`,
    description: `${shop.name} in Regina, SK. Services: ${shop.services.join(
      ", "
    )}. Address: ${shop.address}. Call or get directions.`,
    alternates: {
      canonical: `/regina-sk/shops/${shop.slug}`,
    },
    openGraph: {
      title: `${shop.name} (Regina, SK)`,
      description: `${shop.name} in Regina, SK. Services: ${shop.services.join(
        ", "
      )}.`,
      url: `/regina-sk/shops/${shop.slug}`,
    },
  };
}


export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = SHOPS.find((s) => s.slug === slug);

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

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <Link href="/cities/regina-sk" style={{ textDecoration: "none" }}>
        ← Back to Regina
      </Link>

      <h1 style={{ fontSize: 34, fontWeight: 900, marginTop: 12 }}>
        {shop.name}
      </h1>

      <div style={{ marginTop: 8, opacity: 0.85 }}>{shop.address}</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        {shop.phone ? (
          <a
            href={`tel:${shop.phone}`}
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
