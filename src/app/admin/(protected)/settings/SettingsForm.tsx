"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveSettingsAction, type SettingsFormState } from "./actions";
import type { SiteSettings } from "@/lib/settings";

const inputClass =
  "block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Settings"}
    </button>
  );
}

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useFormState<SettingsFormState, FormData>(saveSettingsAction, {});

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Phone (tel: link)" hint="Include country code, e.g. +91-9999999999">
          <input name="phone" defaultValue={settings.phone} required className={inputClass} />
        </Field>
        <Field label="Phone (displayed)" hint="Formatted for humans, e.g. +91 99999 99999">
          <input
            name="phoneDisplay"
            defaultValue={settings.phoneDisplay}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="WhatsApp Number"
        hint="Digits only with country code, no + or spaces, e.g. 919999999999"
      >
        <input
          name="whatsappNumber"
          defaultValue={settings.whatsappNumber}
          required
          pattern="\d{10,15}"
          className={inputClass}
        />
      </Field>

      <Field label="Email">
        <input type="email" name="email" defaultValue={settings.email} required className={inputClass} />
      </Field>

      <Field label="GSTIN" hint="Printed on invoices and used to determine CGST+SGST vs IGST split.">
        <input
          name="gstin"
          defaultValue={settings.gstin}
          className={`${inputClass} font-mono uppercase`}
        />
      </Field>

      <div className="border-t border-concrete-200 pt-6">
        <h3 className="text-sm font-semibold text-navy-900">Address</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Street / Plot">
            <input name="addressStreet" defaultValue={settings.addressStreet} className={inputClass} />
          </Field>
          <Field label="City">
            <input name="addressLocality" defaultValue={settings.addressLocality} className={inputClass} />
          </Field>
          <Field label="State">
            <input name="addressRegion" defaultValue={settings.addressRegion} className={inputClass} />
          </Field>
          <Field label="Postal Code">
            <input
              name="addressPostalCode"
              defaultValue={settings.addressPostalCode}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field
        label="Google Maps Embed URL"
        hint='From Google Maps → Share → Embed a map → copy the "src" value inside the iframe.'
      >
        <textarea
          name="mapEmbedSrc"
          defaultValue={settings.mapEmbedSrc}
          rows={3}
          className={`${inputClass} font-mono text-xs`}
        />
      </Field>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm font-medium text-green-700">
          Settings saved.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
