"use server";

import { licenseLockError } from "@/lib/license";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createPayment,
  deletePayment,
  type PaymentDirection,
  type PaymentMode,
} from "@/lib/payments";
import { rupeesToPaise } from "@/lib/money";

export interface PaymentFormState {
  error?: string;
}

const MODES = ["CASH", "UPI", "BANK", "CHEQUE", "OTHER"];

export async function createPaymentAction(
  _prev: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const partyId = String(formData.get("partyId") ?? "").trim();
  const invoiceId = String(formData.get("invoiceId") ?? "").trim() || null;
  const direction = (formData.get("direction") === "OUT" ? "OUT" : "IN") as PaymentDirection;
  const amountPaise = rupeesToPaise(String(formData.get("amount") ?? "0"));
  const dateRaw = String(formData.get("paymentDate") ?? "");
  const modeRaw = String(formData.get("mode") ?? "CASH");

  if (!partyId) return { error: "Select a party." };
  if (amountPaise <= 0) return { error: "Enter an amount greater than zero." };
  const paymentDate = new Date(dateRaw);
  if (Number.isNaN(paymentDate.getTime())) return { error: "Enter a valid date." };

  const result = await createPayment({
    partyId,
    invoiceId: direction === "IN" ? invoiceId : null,
    direction,
    amountPaise,
    paymentDate,
    mode: (MODES.includes(modeRaw) ? modeRaw : "CASH") as PaymentMode,
    reference: String(formData.get("reference") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  });
  if (!result.ok) return { error: result.error };

  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  redirect("/admin/payments");
}

export async function deletePaymentAction(id: string): Promise<{ error?: string }> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  await deletePayment(id);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  return {};
}
