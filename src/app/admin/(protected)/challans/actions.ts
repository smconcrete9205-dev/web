"use server";

import { licenseLockError } from "@/lib/license";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createChallan,
  updateChallan,
  deleteChallan,
  type ChallanInput,
  type ChallanItem,
} from "@/lib/challans";

export interface ChallanFormState {
  error?: string;
}

function parseItems(value: FormDataEntryValue | null): ChallanItem[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item?.description)
      .map((item) => ({
        description: String(item.description).trim(),
        quantity: Number(item.quantity) || 0,
        unit: String(item.unit ?? "").trim() || "Nos",
      }));
  } catch {
    return [];
  }
}

function parseFormData(formData: FormData): ChallanInput {
  return {
    partyId: String(formData.get("partyId") ?? "").trim(),
    invoiceId: String(formData.get("invoiceId") ?? "").trim() || null,
    challanDate: new Date(String(formData.get("challanDate") ?? "")),
    vehicleNo: String(formData.get("vehicleNo") ?? "").trim().toUpperCase(),
    driverName: String(formData.get("driverName") ?? "").trim(),
    deliveryAddress: String(formData.get("deliveryAddress") ?? "").trim(),
    items: parseItems(formData.get("items")),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

function validate(input: ChallanInput): string | null {
  if (!input.partyId) return "Select a customer.";
  if (Number.isNaN(input.challanDate.getTime())) return "Enter a valid date.";
  if (input.items.length === 0) return "Add at least one item.";
  if (input.items.some((i) => i.quantity <= 0)) return "Every item needs a quantity greater than zero.";
  return null;
}

export async function createChallanAction(
  _prev: ChallanFormState,
  formData: FormData
): Promise<ChallanFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const input = parseFormData(formData);
  const error = validate(input);
  if (error) return { error };

  const challan = await createChallan(input);
  revalidatePath("/admin/challans");
  redirect(`/admin/challans/${challan.id}/print`);
}

export async function updateChallanAction(
  id: string,
  _prev: ChallanFormState,
  formData: FormData
): Promise<ChallanFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const input = parseFormData(formData);
  const error = validate(input);
  if (error) return { error };

  await updateChallan(id, input);
  revalidatePath("/admin/challans");
  redirect("/admin/challans");
}

export async function deleteChallanAction(id: string): Promise<{ error?: string }> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  await deleteChallan(id);
  revalidatePath("/admin/challans");
  return {};
}
