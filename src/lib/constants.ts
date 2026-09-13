/**
 * Sitewide brand identity constants — name, tagline, business hours, socials.
 *
 * Contact details that change more often (phone, email, WhatsApp number,
 * address, map embed) live in the database and are edited via /admin/settings
 * (see src/lib/settings.ts). The values below are only used as the initial
 * seed (prisma/seed.ts) and as a fallback if the settings table is empty —
 * pages should call getSiteSettings() for the live values, not this file.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.smconcreteproducts.com";

export const COMPANY = {
  name: "SM Concrete Products",
  legalName: "SM Concrete Products",
  tagline: "Precast RCC Concrete Products Manufacturer",
  description:
    "SM Concrete Products is a manufacturer of high-quality RCC precast concrete products including manhole covers, spun pipes, slabs, route markers, interlocking tiles, and kerb stones, built to IS code standards for municipal, infrastructure, and industrial projects.",
  foundingYear: "2005",
  phone: "+91-9205420447",
  phoneDisplay: "+91 92054 20447",
  whatsappNumber: "919205420447",
  email: "smconcrete9205@gmail.com",
  gstin: "06KWGPS5160H1Z3",
  address: {
    streetAddress: "1202, Village Atali, Chhainsa",
    addressLocality: "Faridabad",
    addressRegion: "Haryana",
    postalCode: "121004",
    addressCountry: "IN",
  },
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1690000000000",
  mapUrl: "https://maps.google.com/?q=SM+Concrete+Products",
  businessHours: [
    { day: "Monday - Saturday", hours: "9:00 AM - 6:30 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  socials: {
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
} as const;
