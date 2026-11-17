"use server";

import { licenseLockError } from "@/lib/license";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  cancelInvoice,
  type InvoiceInput,
  type InvoiceItem,
  type InvoiceStatus,
} from "@/lib/invoices";
import { getSiteSettings } from "@/lib/settings";

export interface InvoiceFormState {
  error?: string;
}

function parseItems(value: FormDataEntryValue | null): InvoiceItem[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item?.description)
      .map((item) => ({
        description: String(item.description).trim(),
        hsnCode: String(item.hsnCode ?? "").trim(),
        quantity: Number(item.quantity) || 0,
        unit: String(item.unit ?? "").trim() || "Nos",
        rate: Number(item.rate) || 0,
        gstRate: Number(item.gstRate) || 0,
      }));
  } catch {
    return [];
  }
}

function parseFormData(formData: FormData): InvoiceInput {
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  return {
    partyId: String(formData.get("partyId") ?? "").trim(),
    invoiceDate: new Date(String(formData.get("invoiceDate") ?? "")),
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    items: parseItems(formData.get("items")),
    placeOfSupply: String(formData.get("placeOfSupply") ?? "").trim(),
    status: (["DRAFT", "SENT", "CANCELLED"].includes(String(formData.get("status")))
      ? String(formData.get("status"))
      : "DRAFT") as InvoiceStatus,
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

function validate(input: InvoiceInput): string | null {
  if (!input.partyId) return "Select a customer.";
  if (!input.placeOfSupply) return "Select a place of supply.";
  if (input.items.length === 0) return "Add at least one line item.";
  if (input.items.some((item) => !item.description || item.quantity <= 0 || item.rate < 0)) {
    return "Every line item needs a description, a positive quantity, and a non-negative rate.";
  }
  return null;
}

export async function createInvoiceAction(
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const settings = await getSiteSettings();
  const invoice = await createInvoice(input, settings.addressRegion);

  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}

export async function updateInvoiceAction(
  id: string,
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const settings = await getSiteSettings();
  await updateInvoice(id, input, settings.addressRegion);

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  redirect("/admin/invoices");
}

export async function deleteInvoiceAction(id: string): Promise<{ error?: string }> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const result = await deleteInvoice(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/admin/invoices");
  return {};
}

export async function cancelInvoiceAction(id: string): Promise<{ error?: string }> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  await cancelInvoice(id);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  return {};
}
