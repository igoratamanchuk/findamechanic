import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { REGINA_CITY, REGINA_SHOPS } from "@/data/shops/regina";

const CANONICAL_PATH = `/cities/${REGINA_CITY.slug}`;
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

export const metadata: Metadata = {
  title: `Auto Repair Shops in ${REGINA_CITY.name}, ${REGINA_CITY.region} | FindAMechanic.ca`,
  description:
    "Browse auto repair shops in Regina, Saskatchewan. Compare services like brakes, tires, diagnostics and find the best local mechanic for your needs.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: `Auto Repair Shops in ${REGINA_CITY.name}, ${REGINA_CITY.region}`,
    description:
      "Browse auto repair shops in Regina, Saskatchewan. Compare services like brakes, tires, diagnostics and find the best local mechanic for your needs.",
    url: CANONICAL_URL,
    siteName: "FindAMechanic.ca",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `Auto Repair Shops in ${REGINA_CITY.name}, ${REGINA_CITY.region}`,
    description:
      "Browse auto repair shops in Regina, Saskatchewan. Compare services like brakes, tires, diagnostics and find the best local mechanic for your needs.",
  },
};

export default function ReginaDirectory() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900 }}>
            Auto Repair Shops in {REGINA_CITY.name}, {REGINA_CITY.region}
          </h1>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Browse local mechanics by service and specialty. (MVP — more shops
            coming.)
          </p>
        </div>

        <Link
          href="/"
          style={{
            padding: "10px 14px",
            border: "1px solid #ddd",
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Home
        </Link>
      </header>

      <section style={{ marginTop: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {REGINA_SHOPS.map((s) => (
            <Link
              key={s.slug}
              href={`/${REGINA_CITY.slug}/shops/${s.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #eee",
                borderRadius: 14,
                padding: 14,
                boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900 }}>{s.name}</div>

              <div style={{ marginTop: 6, opacity: 0.8, fontSize: 14 }}>
                {s.neighborhood ? `${s.neighborhood} • ` : ""}
                {s.address}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {s.services.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      border: "1px solid #eee",
                      padding: "5px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {t}
                  </span>
                ))}

                {s.services.length > 3 ? (
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    +{s.services.length - 3} more
                  </span>
                ) : null}
              </div>

              {s.description ? (
                <div style={{ marginTop: 10, opacity: 0.85, fontSize: 14 }}>
                  {s.description}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
