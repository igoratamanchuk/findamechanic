import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://findamechanic-b14p.vercel.app"),
  title: {
    default: "Find a Mechanic in Canada | FindAMechanic.ca",
    template: "%s | FindAMechanic.ca",
  },
  description:
    "Find trusted auto repair shops across Canada. Browse by city, services, and specialties. Compare local mechanics and contact shops directly.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "FindAMechanic.ca",
    title: "Find a Mechanic in Canada | FindAMechanic.ca",
    description:
      "Browse trusted local auto repair shops by city and service across Canada.",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
