"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Product, ProductBilling } from "@/lib/products";
import type { ProductFormState } from "./actions";
import ImageManager from "./ImageManager";

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

interface ProductFormProps {
  product?: Product;
  billing?: ProductBilling;
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}

export default function ProductForm({ product, billing, action }: ProductFormProps) {
  const [state, formAction] = useFormState<ProductFormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Product Name">
          <input
            name="name"
            defaultValue={product?.name}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Slug" hint="Lowercase letters, numbers, hyphens only. Becomes /products/<slug>">
          <input
            name="slug"
            defaultValue={product?.slug}
            required
            pattern="[a-z0-9-]+"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Short Description" hint="Shown on cards and the quote form dropdown.">
        <textarea
          name="shortDescription"
          defaultValue={product?.shortDescription}
          rows={2}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Full Description" hint="One paragraph per line.">
        <textarea
          name="description"
          defaultValue={product?.description.join("\n")}
          rows={5}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Features" hint="One feature per line.">
          <textarea
            name="features"
            defaultValue={product?.features.join("\n")}
            rows={5}
            className={inputClass}
          />
        </Field>
        <Field label="Applications" hint="One application per line.">
          <textarea
            name="applications"
            defaultValue={product?.applications.join("\n")}
            rows={5}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Specifications" hint={'One per line, formatted as "Label: Value" — e.g. "IS Code Reference: IS 458"'}>
        <textarea
          name="specs"
          defaultValue={product?.specs.map((s) => `${s.label}: ${s.value}`).join("\n")}
          rows={6}
          className={`${inputClass} font-mono`}
        />
      </Field>

      <div className="border-t border-concrete-200 pt-6">
        <h3 className="text-sm font-semibold text-navy-900">Billing defaults</h3>
        <p className="mt-0.5 text-xs text-concrete-500">
          Auto-fills invoice and challan lines when this product is picked. Never shown on the public site.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Rate (₹ per unit)">
            <input
              type="number"
              name="rate"
              step="0.01"
              min="0"
              defaultValue={billing?.rate ?? 0}
              className={inputClass}
            />
          </Field>
          <Field label="Unit">
            <input name="unit" defaultValue={billing?.unit ?? "Nos"} className={inputClass} />
          </Field>
          <Field label="HSN code">
            <input name="hsnCode" defaultValue={billing?.hsnCode ?? "6810"} className={`${inputClass} font-mono`} />
          </Field>
          <Field label="GST %">
            <input
              type="number"
              name="gstRate"
              step="0.1"
              min="0"
              max="100"
              defaultValue={billing?.gstRate ?? 18}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Images" hint="Upload files directly — no need to add them to the project yourself.">
        <ImageManager initialImages={product?.images ?? []} />
      </Field>

      <div className="border-t border-concrete-200 pt-6">
        <h3 className="text-sm font-semibold text-navy-900">SEO</h3>
        <div className="mt-4 space-y-4">
          <Field label="SEO Title">
            <input
              name="seoTitle"
              defaultValue={product?.seo.title}
              required
              className={inputClass}
            />
          </Field>
          <Field label="SEO Description">
            <textarea
              name="seoDescription"
              defaultValue={product?.seo.description}
              rows={2}
              required
              className={inputClass}
            />
          </Field>
          <Field label="SEO Keywords" hint="One keyword phrase per line.">
            <textarea
              name="seoKeywords"
              defaultValue={product?.seo.keywords.join("\n")}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={product ? "Save Changes" : "Create Product"} />
    </form>
  );
}
