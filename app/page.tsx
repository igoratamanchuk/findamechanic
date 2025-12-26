import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 40, fontWeight: 900 }}>Find a Mechanic</h1>

      <p style={{ marginTop: 12, opacity: 0.85, lineHeight: 1.6 }}>
        Find trusted auto repair shops across Canada. Starting with Regina, Saskatchewan.
      </p>

      <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/cities/regina-sk"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
          }}
        >
          Browse Regina shops →
        </Link>
      </div>
    </main>
  );
}
