"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Party } from "@/lib/parties";
import type { PartyFormState } from "./actions";
import { INDIAN_STATES } from "@/lib/indianStates";

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
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-concrete-500">{hint}</p>}
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

interface PartyFormProps {
  party?: Party;
  action: (state: PartyFormState, formData: FormData) => Promise<PartyFormState>;
}

export default function PartyForm({ party, action }: PartyFormProps) {
  const [state, formAction] = useFormState<PartyFormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={party?.name} required className={inputClass} />
        </Field>
        <Field label="Type">
          <select name="type" defaultValue={party?.type ?? "CUSTOMER"} className={inputClass}>
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
            <option value="BOTH">Both</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Phone">
          <input name="phone" defaultValue={party?.phone} required className={inputClass} />
        </Field>
        <Field label="Email">
          <input type="email" name="email" defaultValue={party?.email} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="GSTIN" hint="15 characters, e.g. 06KWGPS5160H1Z3">
          <input
            name="gstin"
            defaultValue={party?.gstin}
            maxLength={15}
            className={`${inputClass} font-mono uppercase`}
          />
        </Field>
        <Field label="PAN">
          <input
            name="pan"
            defaultValue={party?.pan}
            maxLength={10}
            className={`${inputClass} font-mono uppercase`}
          />
        </Field>
      </div>

      <div className="border-t border-concrete-200 pt-6">
        <h3 className="text-sm font-semibold text-navy-900">Address</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Street / Plot">
            <input name="addressStreet" defaultValue={party?.addressStreet} className={inputClass} />
          </Field>
          <Field label="City">
            <input name="addressLocality" defaultValue={party?.addressLocality} className={inputClass} />
          </Field>
          <Field label="State" hint="Determines CGST+SGST vs IGST on invoices.">
            <select name="addressRegion" defaultValue={party?.addressRegion ?? ""} className={inputClass}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Postal Code">
            <input
              name="addressPostalCode"
              defaultValue={party?.addressPostalCode}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Opening Balance (₹)" hint="Positive = party owes us. Negative = we owe party.">
        <input
          type="number"
          step="0.01"
          name="openingBalance"
          defaultValue={party?.openingBalance ?? 0}
          className={inputClass}
        />
      </Field>

      <Field label="Notes">
        <textarea name="notes" defaultValue={party?.notes} rows={3} className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm font-medium text-navy-900">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={party?.isActive ?? true}
          className="h-4 w-4 rounded border-concrete-300 text-accent-500 focus:ring-accent-500"
        />
        Active
      </label>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={party ? "Save Changes" : "Create Party"} />
    </form>
  );
}
