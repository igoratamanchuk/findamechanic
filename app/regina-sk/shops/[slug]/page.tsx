// app/regina-sk/shops/[slug]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import type { Metadata } from "next";

import { absUrl } from "@/lib/site";
import { REGINA_CITY, REGINA_SHOPS } from "@/data/shops/regina";

const SITE_NAME = "FindAMechanic.ca";

function getShop(slug: string) {
  return REGINA_SHOPS.find((s) => s.slug === slug);
}

function cleanTel(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
      {label}
    </span>
  );
}

function ActionLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shop = getShop(slug);

  const canonicalPath = `/${REGINA_CITY.slug}/shops/${slug}`;
  const canonicalUrl = absUrl(canonicalPath);

  if (!shop) {
    return {
      title: `Shop not found | ${SITE_NAME}`,
      description: "Auto repair shop profile not found.",
      robots: { index: false, follow: true },
      alternates: { canonical: canonicalUrl },
    };
  }

  const title = `${shop.name} (${REGINA_CITY.name})`;
  const description = `${shop.name} in Regina, SK. Services: ${shop.services.join(
    ", "
  )}. Address: ${shop.address}. Call or get directions.`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = getShop(slug);

  const backHref = `/cities/${REGINA_CITY.slug}`;

  if (!shop) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-black">Shop not found</h1>
        <p className="mt-2 text-sm text-gray-600">Slug: {slug}</p>

        <div className="mt-6">
          <Link href={backHref} className="hover:underline">
            ← Back to {REGINA_CITY.name}
          </Link>
        </div>
      </main>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    shop.address
  )}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Back */}
      <Link href={backHref} className="hover:underline">
        ← Back to {REGINA_CITY.name}
      </Link>

      {/* Title */}
      <h1 className="mt-4 text-4xl font-black tracking-tight">{shop.name}</h1>
      <p className="mt-2 text-gray-700">{shop.address}</p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {shop.phone ? (
          <a
            href={`tel:${cleanTel(shop.phone)}`}
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Call: {shop.phone}
          </a>
        ) : null}

        {shop.website ? (
          <ActionLink href={shop.website} external>
            Website
          </ActionLink>
        ) : null}

        <ActionLink href={mapsUrl} external>
          Get directions
        </ActionLink>
      </div>

      {/* About */}
      {shop.description ? (
        <section className="mt-8">
          <h2 className="text-lg font-black">About</h2>
          <p className="mt-2 leading-7 text-gray-700">{shop.description}</p>
        </section>
      ) : null}

      {/* Services */}
      <section className="mt-8">
        <h2 className="text-lg font-black">Services</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {shop.services.map((x) => (
            <Chip key={x} label={x} />
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="mt-8">
        <h2 className="text-lg font-black">Specialties</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {shop.specialties.length ? (
            shop.specialties.map((x) => <Chip key={x} label={x} />)
          ) : (
            <span className="text-sm text-gray-600">Not specified</span>
          )}
        </div>
      </section>
    </main>
  );
}
