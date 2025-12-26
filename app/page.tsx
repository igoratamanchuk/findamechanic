import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "40px 16px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 42, fontWeight: 900 }}>
        Find a Mechanic in Canada
      </h1>

      <p style={{ marginTop: 16, fontSize: 18, opacity: 0.85 }}>
        Browse trusted local auto repair shops by city and service.
      </p>

      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/cities/regina-sk"
          style={{
            padding: "14px 20px",
            borderRadius: 14,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Regina, SK
        </Link>

        {/* Future cities */}
        <span
          style={{
            padding: "14px 20px",
            borderRadius: 14,
            border: "1px dashed #ddd",
            opacity: 0.5,
          }}
        >
          Saskatoon (coming soon)
        </span>
      </div>

      <section style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>
          How it works
        </h2>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <h3 style={{ fontWeight: 700 }}>1. Choose your city</h3>
            <p style={{ opacity: 0.8 }}>
              Find mechanics near you.
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 700 }}>2. Compare shops</h3>
            <p style={{ opacity: 0.8 }}>
              Browse services and specialties.
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 700 }}>3. Contact directly</h3>
            <p style={{ opacity: 0.8 }}>
              Call or visit the shop website.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
