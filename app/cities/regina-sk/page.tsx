import Link from "next/link";

type Shop = {
  name: string;
  slug: string;
  address: string;
  phone?: string;
  website?: string;
  services: string[];
  specialties: string[];
  neighborhood?: string;
  description?: string;
};

const shops: Shop[] = [
  {
    name: "Sample Auto Repair",
    slug: "sample-auto-repair",
    address: "123 Example St, Regina, SK",
    phone: "306-555-1234",
    website: "https://example.com",
    services: ["Brakes", "Diagnostics", "Tires"],
    specialties: ["Domestic"],
    neighborhood: "Downtown",
    description: "General repair and diagnostics in Regina.",
  },
];

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
            Auto Repair Shops in Regina, SK
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
          {shops.map((s) => (
            <Link
              key={s.slug}
              href={`/regina-sk/shops/${s.slug}`}
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
