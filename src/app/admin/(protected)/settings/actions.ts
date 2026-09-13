"use server";

import { revalidatePath } from "next/cache";
import { updateSiteSettings } from "@/lib/settings";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function saveSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const phoneDisplay = String(formData.get("phoneDisplay") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const addressStreet = String(formData.get("addressStreet") ?? "").trim();
  const addressLocality = String(formData.get("addressLocality") ?? "").trim();
  const addressRegion = String(formData.get("addressRegion") ?? "").trim();
  const addressPostalCode = String(formData.get("addressPostalCode") ?? "").trim();
  const mapEmbedSrc = String(formData.get("mapEmbedSrc") ?? "").trim();
  const gstin = String(formData.get("gstin") ?? "").trim().toUpperCase();

  if (!phone || !phoneDisplay || !whatsappNumber || !email) {
    return { error: "Phone, phone display, WhatsApp number, and email are required." };
  }
  if (!/^\d{10,15}$/.test(whatsappNumber)) {
    return { error: "WhatsApp number must be digits only, with country code (e.g. 919999999999)." };
  }

  await updateSiteSettings({
    phone,
    phoneDisplay,
    whatsappNumber,
    email,
    addressStreet,
    addressLocality,
    addressRegion,
    addressPostalCode,
    mapEmbedSrc,
    gstin,
  });

  revalidatePath("/", "layout");

  return { success: true };
}
