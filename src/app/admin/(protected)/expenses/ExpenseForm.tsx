"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Field, SubmitButton } from "../FormUi";
import { inputClass, toDateInputValue } from "../formStyles";
import { EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/lib/erpOptions";
import { createExpenseAction, type ExpenseFormState } from "./actions";

export default function ExpenseForm({ vendors }: { vendors: { id: string; name: string }[] }) {
  const [state, formAction] = useFormState<ExpenseFormState, FormData>(createExpenseAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after each successful save so entries can be added back-to-back.
  useEffect(() => {
    if (state.saved) formRef.current?.reset();
  }, [state.saved]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Field label="Category">
          <select name="category" defaultValue="Raw Material" className={inputClass}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount (₹)">
          <input type="number" name="amount" step="0.01" min="0.01" required className={inputClass} />
        </Field>
        <Field label="Date">
          <input
            type="date"
            name="expenseDate"
            defaultValue={toDateInputValue(new Date())}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Mode">
          <select name="mode" defaultValue="CASH" className={inputClass}>
            {PAYMENT_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Description">
          <input name="description" placeholder="e.g. Cement 50 bags" className={inputClass} />
        </Field>
        <Field label="Vendor (optional)">
          <select name="partyId" defaultValue="" className={inputClass}>
            <option value="">—</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      {state.saved ? <p className="text-sm font-medium text-green-700">Expense saved.</p> : null}

      <SubmitButton label="Add Expense" />
    </form>
  );
}
