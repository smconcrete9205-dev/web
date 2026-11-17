import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvoiceById } from "@/lib/invoices";
import { getPartiesByType } from "@/lib/parties";
import { getSiteSettings } from "@/lib/settings";
import { getPaymentsByInvoice } from "@/lib/payments";
import { getItemSuggestions } from "@/lib/itemSuggestions";
import { formatINR } from "@/lib/money";
import InvoiceForm from "../InvoiceForm";
import DeletePaymentButton from "../../payments/DeletePaymentButton";
import { updateInvoiceAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, parties, settings, payments, suggestions] = await Promise.all([
    getInvoiceById(params.id),
    getPartiesByType("CUSTOMER"),
    getSiteSettings(),
    getPaymentsByInvoice(params.id),
    getItemSuggestions(),
  ]);
  if (!invoice) notFound();
  const canPay =
    invoice.status !== "DRAFT" && invoice.status !== "CANCELLED" && invoice.balancePaise > 0;

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Invoice</h1>
          <p className="mt-1 text-sm text-concrete-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/challans/new?invoiceId=${invoice.id}`}
            className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
          >
            + Challan
          </Link>
          <Link
            href={`/admin/invoices/${invoice.id}/print`}
            target="_blank"
            className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
          >
            Print / PDF
          </Link>
        </div>
      </div>

      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-navy-900">Payments</h2>
          {canPay && (
            <Link
              href={`/admin/payments/new?invoiceId=${invoice.id}`}
              className="rounded-md bg-accent-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-600"
            >
              + Add payment
            </Link>
          )}
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div><dt className="text-concrete-500">Total</dt><dd className="font-semibold text-navy-900">{formatINR(invoice.totalPaise)}</dd></div>
          <div><dt className="text-concrete-500">Received</dt><dd className="font-semibold text-green-700">{formatINR(invoice.paidPaise)}</dd></div>
          <div><dt className="text-concrete-500">Balance</dt><dd className="font-semibold text-red-600">{formatINR(invoice.balancePaise)}</dd></div>
        </dl>
        {payments.length > 0 && (
          <ul className="mt-4 divide-y divide-concrete-100 border-t border-concrete-100 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-concrete-600">
                  {p.paymentDate.toLocaleDateString("en-IN")} · {p.mode}
                  {p.reference ? ` · ${p.reference}` : ""}
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-medium text-navy-900">{formatINR(p.amountPaise)}</span>
                  <DeletePaymentButton id={p.id} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        <InvoiceForm
          invoice={invoice}
          parties={parties.map((p) => ({ id: p.id, name: p.name, addressRegion: p.addressRegion }))}
          businessState={settings.addressRegion}
          suggestions={suggestions}
          action={action}
        />
      </div>
    </div>
  );
}
