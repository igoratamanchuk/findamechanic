// data/shops/types.ts

export type ServiceTag =
  | "general"
  | "maintenance"
  | "oil_change"
  | "diagnostics"
  | "brakes"
  | "suspension"
  | "alignment"
  | "tires"
  | "ac"
  | "engine"
  | "transmission"
  | "exhaust"
  | "electrical"
  | "body"
  | "collision"
  | "fleet"
  | "commercial"
  | "performance"
  | "restoration"
  | "truck"
  | "trailer";

export type SpecialtyTag =
  | "domestic"
  | "import"
  | "european"
  | "asian"
  | "ford"
  | "gm"
  | "toyota"
  | "honda"
  | "mercedes"
  | "bmw"
  | "vw_audi"
  | "fleet"
  | "commercial"
  | "electrical"
  | "body"
  | "performance"
  | "restoration";

export type City = {
  slug: string;
  name: string;
  province: string;
  country: string;
};

export type Shop = {
  slug: string;
  name: string;
  address: string;

  phone?: string;
  website?: string;
  neighborhood?: string;

  services: string[];
  specialties: string[];
  description?: string;

  // optional derived tags (computed by deriveTags)
  serviceTags?: ServiceTag[];
  specialtyTags?: SpecialtyTag[];
};
