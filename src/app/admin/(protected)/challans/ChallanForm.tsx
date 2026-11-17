"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Field, SubmitButton } from "../FormUi";
import { inputClass, toDateInputValue } from "../formStyles";
import type { Challan, ChallanItem } from "@/lib/challans";
import type { ChallanFormState } from "./actions";
import type { ItemSuggestion } from "@/lib/itemSuggestions";

interface Props {
  challan?: Challan;
  parties: { id: string; name: string }[];
  invoices: { id: string; partyId: string; number: string; items: ChallanItem[] }[];
  defaultInvoiceId?: string;
  suggestions?: ItemSuggestion[];
  action: (state: ChallanFormState, formData: FormData) => Promise<ChallanFormState>;
}

const EMPTY: ChallanItem = { description: "", quantity: 1, unit: "Nos" };
const cellInput =
  "block w-full rounded border border-concrete-300 px-2 py-1.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

export default function ChallanForm({ challan, parties, invoices, defaultInvoiceId, suggestions = [], action }: Props) {
  const [state, formAction] = useFormState<ChallanFormState, FormData>(action, {});
  const preset = invoices.find((i) => i.id === defaultInvoiceId);

  const [partyId, setPartyId] = useState(challan?.partyId ?? preset?.partyId ?? parties[0]?.id ?? "");
  const [invoiceId, setInvoiceId] = useState(challan?.invoiceId ?? preset?.id ?? "");
  const [items, setItems] = useState<ChallanItem[]>(
    challan?.items.length ? challan.items : preset?.items.length ? preset.items : [EMPTY]
  );

  const partyInvoices = invoices.filter((i) => i.partyId === partyId);

  function onInvoiceChange(id: string) {
    setInvoiceId(id);
    const inv = invoices.find((i) => i.id === id);
    if (inv && inv.items.length) setItems(inv.items.map((i) => ({ ...i })));
  }

  function update(index: number, patch: Partial<ChallanItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Customer">
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
            {parties.length === 0 && <option value="">No customers yet - add one first</option>}
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Against Invoice (optional)">
          <select
            name="invoiceId"
            value={invoiceId}
            onChange={(e) => onInvoiceChange(e.target.value)}
            className={inputClass}
          >
            <option value="">- None -</option>
            {partyInvoices.map((i) => (
              <option key={i.id} value={i.id}>
                {i.number}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-concrete-500">Picking an invoice copies its items below.</p>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="Date">
          <input
            type="date"
            name="challanDate"
            defaultValue={toDateInputValue(challan?.challanDate)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Vehicle No.">
          <input name="vehicleNo" defaultValue={challan?.vehicleNo} placeholder="MH12 AB 1234" className={inputClass} />
        </Field>
        <Field label="Driver Name">
          <input name="driverName" defaultValue={challan?.driverName} className={inputClass} />
        </Field>
      </div>

      <Field label="Delivery Address / Site">
        <textarea name="deliveryAddress" defaultValue={challan?.deliveryAddress} rows={2} className={inputClass} />
      </Field>

      <div>
        <h3 className="text-sm font-semibold text-navy-900">Items Delivered</h3>
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <datalist id="challan-products">
          {suggestions.map((s) => (
            <option key={s.name} value={s.name} />
          ))}
        </datalist>
        <div className="mt-2 overflow-x-auto rounded-lg border border-concrete-200">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
              <tr>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200 bg-white">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">
                    <input
                      value={item.description}
                      list="challan-products"
                      onChange={(e) => {
                        const m = suggestions.find(
                          (s) => s.name.toLowerCase() === e.target.value.trim().toLowerCase()
                        );
                        update(i, m ? { description: m.name, unit: m.unit } : { description: e.target.value });
                      }}
                      placeholder="Pick a product or type..."
                      className={cellInput}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => update(i, { quantity: parseFloat(e.target.value) || 0 })}
                      className={`${cellInput} w-24`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={item.unit}
                      onChange={(e) => update(i, { unit: e.target.value })}
                      className={`${cellInput} w-24`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      disabled={items.length === 1}
                      onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { ...EMPTY }])}
          className="mt-3 rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
        >
          + Add Line
        </button>
      </div>

      <Field label="Notes">
        <textarea name="notes" defaultValue={challan?.notes} rows={2} className={inputClass} />
      </Field>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={challan ? "Save Changes" : "Create Challan"} />
    </form>
  );
}
