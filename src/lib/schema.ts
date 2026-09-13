import { COMPANY, SITE_URL } from "@/lib/constants";
import { getSiteSettings } from "@/lib/settings";
import type { Product } from "@/lib/products";

export async function organizationSchema() {
  const settings = await getSiteSettings();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    description: COMPANY.description,
    foundingDate: COMPANY.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressStreet,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      postalCode: settings.addressPostalCode,
      addressCountry: COMPANY.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "sales",
      email: settings.email,
      areaServed: "IN",
    },
  };
}

export async function localBusinessSchema() {
  const settings = await getSiteSettings();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY.name,
    image: `${SITE_URL}/images/hero.jpg`,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressStreet,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      postalCode: settings.addressPostalCode,
      addressCountry: COMPANY.address.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:30",
      },
    ],
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: `${SITE_URL}${product.images[0]?.src ?? "/images/hero.jpg"}`,
    brand: {
      "@type": "Brand",
      name: COMPANY.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: COMPANY.name,
    },
    // No published "offers" block: pricing is quote-based (B2B), not a fixed listed
    // price, so we deliberately avoid emitting an Offer that Search Console would
    // flag for missing/placeholder price data.
    url: `${SITE_URL}/products/${product.slug}`,
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
