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
};

export const REGINA_SHOPS: Shop[] = [
  {
    slug: "progressive-automotive-service",
    name: "Progressive Automotive Service Ltd.",
    address: "1773 McDonald St, Regina, SK S4N 6A9",
    phone: "306-359-6040",
    website: "https://progressiveauto.ca/",
    neighborhood: "East Regina",
    services: [
      "Auto repair",
      "Maintenance",
      "Brakes",
      "Diagnostics",
      "Suspension & alignment",
      "Transmission",
      "A/C service",
    ],
    specialties: ["Domestic", "Import"],
    description: "Full-service auto repair and maintenance in Regina.",
  },
  {
    slug: "rochdale-autopro",
    name: "Rochdale Autopro",
    address: "6320 Rochdale Blvd, Regina, SK S4X 4C2",
    phone: "306-775-1900",
    website: "https://www.rochdaleautopro.ca/",
    neighborhood: "Northwest Regina",
    services: [
      "Auto repair",
      "Maintenance",
      "Brakes",
      "Transmission",
      "Tire services",
      "Diagnostics",
      "Suspension",
      "Exhaust",
      "Engine repair",
    ],
    specialties: ["Domestic", "Import"],
    description: "Auto repair and maintenance shop serving Regina and area.",
  },
  {
    slug: "ok-tire-auto-service-park-street",
    name: "OK Tire & Auto Service",
    address: "1717 Park St, Regina, SK S4N 2G3",
    phone: "306-347-0440",
    website: "https://www.oktireparkstreet.ca/",
    neighborhood: "Central Regina",
    services: ["Auto repair", "Tires", "Brakes", "Maintenance"],
    specialties: ["Domestic", "Import"],
    description: "Auto service and tire shop on Park Street.",
  },
  {
    slug: "punjab-auto-repair",
    name: "Punjab Auto Repair",
    address: "539E - 12th Ave E, Regina, SK S4N 5T7",
    website: "https://locations.autovalue.com/sk/regina/2677566/",
    neighborhood: "East Regina",
    services: ["Auto repair", "Oil services", "Brake services", "Diagnostics"],
    specialties: ["Domestic", "Import"],
    description: "Auto repair shop listed with Auto Value locations.",
  },
  {
    slug: "whitmore-park-napa-autocare",
    name: "Whitmore Park Napa AutoCare",
    address: "4415 Albert St, Regina, SK S4S 6B6",
    phone: "306-586-4228",
    website: "https://www.yellowpages.ca/bus/Saskatchewan/Regina/Whitmore-Park-Napa-AutoCare/7945002.html",
    neighborhood: "South Regina",
    services: ["Auto repair", "Maintenance", "Diagnostics"],
    specialties: ["Domestic", "Import"],
    description: "NAPA AutoCare listing for Whitmore Park area.",
  },

  // Additional Regina entries (address verified from AAA listing; add phone/website later if you want)
  {
    slug: "mainline-fleet-service",
    name: "Mainline Fleet Service Ltd.",
    address: "218 1 Ave E, Regina, SK S4N 5H2",
    services: ["Fleet service", "Repairs", "Maintenance"],
    specialties: ["Fleet", "Commercial"],
    description: "Listed in AAA repair locations for Regina.",
  },
  {
    slug: "minute-muffler-and-brake-victoria",
    name: "Minute Muffler and Brake",
    address: "240 Victoria Ave E, Regina, SK S4N 0N4",
    services: ["Exhaust", "Brakes", "Maintenance"],
    specialties: ["Domestic", "Import"],
    description: "Listed in AAA repair locations for Regina.",
  },
  {
    slug: "caa-saskatchewan-regina",
    name: "CAA Saskatchewan",
    address: "200 Albert St N, Regina, SK S4R 5E2",
    services: ["Auto service", "Maintenance"],
    specialties: ["Domestic", "Import"],
    description: "Listed in AAA repair locations for Regina.",
  },
  {
    slug: "bennett-dunlop-ford-service",
    name: "Bennett Dunlop Ford",
    address: "770 Broad St, Regina, SK S4P 3N4",
    services: ["Service department", "Maintenance", "Repairs"],
    specialties: ["Ford"],
    description: "Listed in AAA repair locations for Regina.",
  },
];
