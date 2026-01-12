// app/cities/regina-sk/page.tsx
import Link from "next/link";

import AiShopFinder from "./AiShopFinder";
import FeedbackModalButton from "@/app/components/FeedbackModal";

import { REGINA_CITY, REGINA_SHOPS } from "@/data/shops/regina";

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
      {label}
    </span>
  );
}

type ShopCardProps = {
  shop: {
    slug: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    neighborhood?: string;
    services: string[];
    specialties: string[];
    description?: string;
  };
};

function ShopCard({ shop }: ShopCardProps) {
  const href = `/${REGINA_CITY.slug}/shops/${shop.slug}`;
  const cleanTel = shop.phone ? shop.phone.replace(/[^\d+]/g, "") : "";

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold leading-tight">
            <Link href={href} className="hover:underline">
              {shop.name}
            </Link>
          </h3>

          <p className="mt-2 text-sm text-gray-700">{shop.address}</p>

          {(shop.neighborhood || shop.phone) && (
            <p className="mt-1 text-sm text-gray-600">
              {shop.neighborhood ?? ""}
              {shop.neighborhood && shop.phone ? " • " : ""}
              {shop.phone ?? ""}
            </p>
          )}
        </div>

        <Link
          href={href}
          className="shrink-0 inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          View
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {shop.services.slice(0, 3).map((s) => (
          <Chip key={`svc-${shop.slug}-${s}`} label={s} />
        ))}
        {shop.services.length > 3 && (
          <span className="text-sm text-gray-600">
            +{shop.services.length - 3} more
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-700">
        {shop.description ?? "Auto repair services in Regina."}
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {shop.website ? (
          <a
            href={shop.website}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Website
          </a>
        ) : null}

        {shop.phone ? (
          <a
            href={`tel:${cleanTel}`}
            className="underline underline-offset-4 hover:opacity-80"
          >
            Call
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} FindAMechanic.ca. All rights reserved.
        </div>

        {/* Feedback pop-up button */}
        <FeedbackModalButton />
      </div>
    </footer>
  );
}

export default function ReginaCityPage() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Auto Repair Shops in {REGINA_CITY.name}
            </h1>
            <p className="mt-2 text-gray-700">
              Browse local mechanics by service and specialty.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Showing {REGINA_SHOPS.length} shops
            </p>
          </div>

          <Link
            href="/"
            className="shrink-0 inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Home
          </Link>
        </header>

        <section className="mt-8">
          <AiShopFinder />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REGINA_SHOPS.map((shop) => (
            <ShopCard key={shop.slug} shop={shop} />
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
