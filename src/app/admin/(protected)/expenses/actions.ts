"use server";

import { licenseLockError } from "@/lib/license";
import { revalidatePath } from "next/cache";
import { createExpense, deleteExpense, EXPENSE_CATEGORIES } from "@/lib/expenses";
import { rupeesToPaise } from "@/lib/money";
import type { PaymentMode } from "@/lib/payments";

export interface ExpenseFormState {
  error?: string;
  saved?: number;
}

const MODES = ["CASH", "UPI", "BANK", "CHEQUE", "OTHER"];

export async function createExpenseAction(
  prev: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  const category = String(formData.get("category") ?? "");
  const amountPaise = rupeesToPaise(String(formData.get("amount") ?? "0"));
  const expenseDate = new Date(String(formData.get("expenseDate") ?? ""));
  const modeRaw = String(formData.get("mode") ?? "CASH");

  if (!(EXPENSE_CATEGORIES as readonly string[]).includes(category)) return { error: "Select a category." };
  if (amountPaise <= 0) return { error: "Enter an amount greater than zero." };
  if (Number.isNaN(expenseDate.getTime())) return { error: "Enter a valid date." };

  await createExpense({
    category,
    description: String(formData.get("description") ?? "").trim(),
    amountPaise,
    expenseDate,
    mode: (MODES.includes(modeRaw) ? modeRaw : "CASH") as PaymentMode,
    partyId: String(formData.get("partyId") ?? "").trim() || null,
  });

  revalidatePath("/admin/expenses");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  return { saved: (prev.saved ?? 0) + 1 };
}

export async function deleteExpenseAction(id: string): Promise<{ error?: string }> {
  const locked = await licenseLockError();
  if (locked) return { error: locked };
  await deleteExpense(id);
  revalidatePath("/admin/expenses");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  return {};
}
