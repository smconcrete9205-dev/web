import { prisma } from "@/lib/prisma";
import { COMPANY } from "@/lib/constants";

/**
 * Editable contact/company settings — managed via /admin/settings.
 * Backed by a single-row SiteSettings table (id is always 1).
 *
 * Company name, tagline, description, founding year, business hours, and
 * socials are considered rarely-changed brand identity and stay in
 * src/lib/constants.ts rather than the admin panel.
 */
export interface SiteSettings {
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  addressStreet: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  mapEmbedSrc: string;
  gstin: string;
}

const SETTINGS_ID = 1;

const FALLBACK_SETTINGS: SiteSettings = {
  phone: COMPANY.phone,
  phoneDisplay: COMPANY.phoneDisplay,
  whatsappNumber: COMPANY.whatsappNumber,
  email: COMPANY.email,
  addressStreet: COMPANY.address.streetAddress,
  addressLocality: COMPANY.address.addressLocality,
  addressRegion: COMPANY.address.addressRegion,
  addressPostalCode: COMPANY.address.postalCode,
  mapEmbedSrc: COMPANY.mapEmbedSrc,
  gstin: COMPANY.gstin,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!row) return FALLBACK_SETTINGS;

  return {
    phone: row.phone,
    phoneDisplay: row.phoneDisplay,
    whatsappNumber: row.whatsappNumber,
    email: row.email,
    addressStreet: row.addressStreet,
    addressLocality: row.addressLocality,
    addressRegion: row.addressRegion,
    addressPostalCode: row.addressPostalCode,
    mapEmbedSrc: row.mapEmbedSrc,
    gstin: row.gstin,
  };
}

export async function updateSiteSettings(input: SiteSettings): Promise<SiteSettings> {
  const row = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...input },
    update: { ...input },
  });

  return {
    phone: row.phone,
    phoneDisplay: row.phoneDisplay,
    whatsappNumber: row.whatsappNumber,
    email: row.email,
    addressStreet: row.addressStreet,
    addressLocality: row.addressLocality,
    addressRegion: row.addressRegion,
    addressPostalCode: row.addressPostalCode,
    mapEmbedSrc: row.mapEmbedSrc,
    gstin: row.gstin,
  };
}

export function getWhatsAppLink(whatsappNumber: string, prefillMessage?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  if (!prefillMessage) return base;
  return `${base}?text=${encodeURIComponent(prefillMessage)}`;
}
