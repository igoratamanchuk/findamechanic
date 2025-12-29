export type Shop = {
  slug: string;
  name: string;
  address: string; // MVP: single string
  phone?: string;
  website?: string;
  services: string[];
  specialties: string[];
  neighborhood?: string;
  description?: string;
};

export const REGINA_CITY = {
  slug: "regina-sk",
  name: "Regina",
  region: "SK",
  country: "CA",
} as const;

export const REGINA_SHOPS: Shop[] = [
  {
    slug: "sample-auto-repair",
    name: "Sample Auto Repair",
    address: "123 Example St, Regina, SK",
    phone: "306-555-1234",
    website: "https://example.com",
    services: ["Brakes", "Diagnostics", "Tires"],
    specialties: ["Domestic"],
    neighborhood: "Downtown",
    description: "General repair and diagnostics in Regina.",
  },
];

export function getReginaShopBySlug(slug: string): Shop | undefined {
  return REGINA_SHOPS.find((s) => s.slug === slug);
}
