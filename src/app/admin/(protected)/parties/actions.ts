"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createParty,
  updateParty,
  deleteParty,
  type PartyInput,
  type PartyType,
} from "@/lib/parties";

export interface PartyFormState {
  error?: string;
}

function parseFormData(formData: FormData): PartyInput {
  return {
    type: String(formData.get("type") ?? "CUSTOMER") as PartyType,
    name: String(formData.get("name") ?? "").trim(),
    gstin: String(formData.get("gstin") ?? "").trim().toUpperCase(),
    pan: String(formData.get("pan") ?? "").trim().toUpperCase(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    addressStreet: String(formData.get("addressStreet") ?? "").trim(),
    addressLocality: String(formData.get("addressLocality") ?? "").trim(),
    addressRegion: String(formData.get("addressRegion") ?? "").trim(),
    addressPostalCode: String(formData.get("addressPostalCode") ?? "").trim(),
    openingBalance: parseFloat(String(formData.get("openingBalance") ?? "0")) || 0,
    notes: String(formData.get("notes") ?? "").trim(),
    isActive: formData.get("isActive") === "on",
  };
}

function validate(input: PartyInput): string | null {
  if (!input.name) return "Name is required.";
  if (!input.phone) return "Phone is required.";
  if (input.gstin && !/^[0-9A-Z]{15}$/.test(input.gstin)) {
    return "GSTIN must be 15 characters (letters and digits only).";
  }
  return null;
}

export async function createPartyAction(
  _prevState: PartyFormState,
  formData: FormData
): Promise<PartyFormState> {
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  await createParty(input);

  revalidatePath("/admin/parties");
  redirect("/admin/parties");
}

export async function updatePartyAction(
  id: string,
  _prevState: PartyFormState,
  formData: FormData
): Promise<PartyFormState> {
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  await updateParty(id, input);

  revalidatePath("/admin/parties");
  redirect("/admin/parties");
}

export async function deletePartyAction(id: string): Promise<void> {
  await deleteParty(id);
  revalidatePath("/admin/parties");
}
