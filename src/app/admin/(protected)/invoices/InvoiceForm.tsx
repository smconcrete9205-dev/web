"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Invoice, InvoiceStatus } from "@/lib/invoices";
import type { InvoiceFormState } from "./actions";
import { INDIAN_STATES } from "@/lib/indianStates";
import { formatINR } from "@/lib/money";
import InvoiceItemsEditor from "./InvoiceItemsEditor";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

interface InvoiceFormProps {
  invoice?: Invoice;
  parties: { id: string; name: string; addressRegion: string }[];
  businessState: string;
  action: (state: InvoiceFormState, formData: FormData) => Promise<InvoiceFormState>;
}

export default function InvoiceForm({ invoice, parties, businessState, action }: InvoiceFormProps) {
  const [state, formAction] = useFormState<InvoiceFormState, FormData>(action, {});
  const [partyId, setPartyId] = useState(invoice?.partyId ?? parties[0]?.id ?? "");
  const [placeOfSupply, setPlaceOfSupply] = useState(
    invoice?.placeOfSupply ?? parties[0]?.addressRegion ?? ""
  );
  const [preview, setPreview] = useState({ subtotal: 0, gst: 0 });

  const isIntraState = useMemo(
    () =>
      Boolean(businessState) &&
      Boolean(placeOfSupply) &&
      businessState.trim().toLowerCase() === placeOfSupply.trim().toLowerCase(),
    [businessState, placeOfSupply]
  );

  function handlePartyChange(id: string) {
    setPartyId(id);
    const party = parties.find((p) => p.id === id);
    if (party?.addressRegion) setPlaceOfSupply(party.addressRegion);
  }

  const total = preview.subtotal + preview.gst;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Customer">
          <select
            name="partyId"
            value={partyId}
            onChange={(e) => handlePartyChange(e.target.value)}
            required
            className={inputClass}
          >
            {parties.length === 0 && <option value="">No customers yet — add one first</option>}
            {parties.map((party) => (
              <option key={party.id} value={party.id}>
                {party.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Place of Supply" >
          <select
            name="placeOfSupply"
            value={placeOfSupply}
            onChange={(e) => setPlaceOfSupply(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="Invoice Date">
          <input
            type="date"
            name="invoiceDate"
            defaultValue={toDateInputValue(invoice?.invoiceDate) || toDateInputValue(new Date())}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Due Date">
          <input
            type="date"
            name="dueDate"
            defaultValue={toDateInputValue(invoice?.dueDate)}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={invoice?.status ?? ("DRAFT" as InvoiceStatus)}
            className={inputClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </Field>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-navy-900">Line Items</h3>
        <div className="mt-2">
          <InvoiceItemsEditor
            initialItems={invoice?.items ?? []}
            onTotalsChange={(subtotal, gst) => setPreview({ subtotal, gst })}
          />
        </div>
      </div>

      <div className="ml-auto max-w-xs space-y-1 rounded-lg border border-concrete-200 bg-concrete-50 p-4 text-sm">
        <div className="flex justify-between text-concrete-700">
          <span>Subtotal</span>
          <span>{formatINR(Math.round(preview.subtotal * 100))}</span>
        </div>
        {isIntraState ? (
          <>
            <div className="flex justify-between text-concrete-700">
              <span>CGST</span>
              <span>{formatINR(Math.round((preview.gst / 2) * 100))}</span>
            </div>
            <div className="flex justify-between text-concrete-700">
              <span>SGST</span>
              <span>{formatINR(Math.round((preview.gst / 2) * 100))}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-concrete-700">
            <span>IGST</span>
            <span>{formatINR(Math.round(preview.gst * 100))}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-concrete-200 pt-1 font-semibold text-navy-900">
          <span>Total</span>
          <span>{formatINR(Math.round(total * 100))}</span>
        </div>
      </div>

      <Field label="Notes">
        <textarea name="notes" defaultValue={invoice?.notes} rows={2} className={inputClass} />
      </Field>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={invoice ? "Save Changes" : "Create Invoice"} />
    </form>
  );
}
