"use client";

import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

interface QuoteRequestFormProps {
  /** Product names for the dropdown — fetched server-side and passed down (this is a Client Component and can't query the database itself). */
  products: { slug: string; name: string }[];
  /** Pre-select a product, e.g. when embedded on a /products/[slug] page. */
  defaultProduct?: string;
  /** Hide the product dropdown entirely (rarely needed — defaults to showing it). */
  showProductField?: boolean;
  className?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function QuoteRequestForm({
  products,
  defaultProduct = "",
  showProductField = true,
  className = "",
}: QuoteRequestFormProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      product: String(formData.get("product") ?? ""),
      quantity: String(formData.get("quantity") ?? ""),
      message: String(formData.get("message") ?? ""),
      sourcePage: pathname ?? "unknown",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className={`rounded-lg border border-green-200 bg-green-50 p-6 text-center ${className}`}
      >
        <h3 className="text-lg font-semibold text-green-800">Thank you!</h3>
        <p className="mt-2 text-sm text-green-700">
          Your quote request has been received. Our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-navy-700 underline underline-offset-2"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-navy-900">
          Full Name <span className="text-accent-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-navy-900">
          Phone Number <span className="text-accent-600">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>

      {showProductField && (
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-navy-900">
            Product
          </label>
          <select
            id="product"
            name="product"
            defaultValue={defaultProduct}
            className="mt-1 block w-full rounded-md border border-concrete-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.slug} value={product.name}>
                {product.name}
              </option>
            ))}
            <option value="Other / General Enquiry">Other / General Enquiry</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-navy-900">
          Estimated Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="text"
          placeholder="e.g. 500 units / 2 truckloads"
          className="mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your project, location, or delivery timeline"
          className="mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Request Quote"}
      </button>
    </form>
  );
}
