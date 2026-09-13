import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { COMPANY, SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | RCC Precast Concrete Products Manufacturer`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  keywords: [
    "RCC precast concrete products",
    "concrete manhole cover manufacturer",
    "RCC spun pipe manufacturer",
    "interlocking tiles manufacturer",
    "kerb stone manufacturer India",
  ],
  openGraph: {
    type: "website",
    siteName: COMPANY.name,
    title: `${COMPANY.name} | RCC Precast Concrete Products Manufacturer`,
    description: COMPANY.description,
    url: SITE_URL,
    images: [{ url: "/images/og-default.svg", width: 1200, height: 630, alt: COMPANY.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} | RCC Precast Concrete Products Manufacturer`,
    description: COMPANY.description,
    images: ["/images/og-default.svg"],
  },
  icons: {
    icon: "/images/logo-mark.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = await organizationSchema();

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <JsonLd data={orgSchema} />
        {children}
      </body>
    </html>
  );
}
