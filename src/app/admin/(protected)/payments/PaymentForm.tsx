"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Field, SubmitButton } from "../FormUi";
import { inputClass, toDateInputValue } from "../formStyles";
import { PAYMENT_MODES } from "@/lib/erpOptions";
import type { PaymentFormState } from "./actions";

interface Props {
  parties: { id: string; name: string }[];
  openInvoices: { id: string; partyId: string; number: string; balanceRupees: number }[];
  defaultInvoiceId?: string;
  action: (state: PaymentFormState, formData: FormData) => Promise<PaymentFormState>;
}

export default function PaymentForm({ parties, openInvoices, defaultInvoiceId, action }: Props) {
  const [state, formAction] = useFormState<PaymentFormState, FormData>(action, {});
  const preset = openInvoices.find((i) => i.id === defaultInvoiceId);

  const [direction, setDirection] = useState<"IN" | "OUT">("IN");
  const [partyId, setPartyId] = useState(preset?.partyId ?? parties[0]?.id ?? "");
  const [invoiceId, setInvoiceId] = useState(preset?.id ?? "");
  const [amount, setAmount] = useState(preset ? String(preset.balanceRupees) : "");

  const partyInvoices = openInvoices.filter((i) => i.partyId === partyId);

  function onInvoiceChange(id: string) {
    setInvoiceId(id);
    const inv = openInvoices.find((i) => i.id === id);
    if (inv) setAmount(String(inv.balanceRupees));
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Type">
          <select
            name="direction"
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as "IN" | "OUT");
              setInvoiceId("");
            }}
            className={inputClass}
          >
            <option value="IN">Received from customer</option>
            <option value="OUT">Paid to vendor</option>
          </select>
        </Field>
        <Field label="Party">
          <select
            name="partyId"
            value={partyId}
            onChange={(e) => {
              setPartyId(e.target.value);
              setInvoiceId("");
            }}
            required
            className={inputClass}
          >
            {parties.length === 0 && <option value="">No parties yet - add one first</option>}
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {direction === "IN" && (
        <Field label="Against Invoice (optional)">
          <select
            name="invoiceId"
            value={invoiceId}
            onChange={(e) => onInvoiceChange(e.target.value)}
            className={inputClass}
          >
            <option value="">- On account (no specific invoice) -</option>
            {partyInvoices.map((i) => (
              <option key={i.id} value={i.id}>
                {i.number} · balance ₹{i.balanceRupees.toFixed(2)}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="Amount (₹)">
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            name="paymentDate"
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

      <Field label="Reference (UTR / cheque no.)">
        <input name="reference" className={inputClass} />
      </Field>
      <Field label="Notes">
        <textarea name="notes" rows={2} className={inputClass} />
      </Field>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label="Save Payment" />
    </form>
  );
}
