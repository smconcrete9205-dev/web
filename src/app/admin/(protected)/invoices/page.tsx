import Link from "next/link";
import { getAllInvoices } from "@/lib/invoices";
import { formatINR } from "@/lib/money";
import DeleteInvoiceButton from "./DeleteInvoiceButton";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-concrete-100 text-concrete-700",
  SENT: "bg-sky-100 text-sky-700",
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-concrete-100 text-concrete-400 line-through",
};

export default async function AdminInvoicesPage() {
  const invoices = await getAllInvoices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Invoices</h1>
          <p className="mt-1 text-sm text-concrete-600">
            {invoices.length} invoice{invoices.length === 1 ? "" : "s"} on record.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New Invoice
        </Link>
      </div>

      <div className="mt-6 space-y-3 lg:hidden">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs font-medium text-navy-900">{invoice.invoiceNumber}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[invoice.status]}`}>
                {invoice.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 font-medium text-concrete-700">{invoice.partyName}</p>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-concrete-500">{invoice.invoiceDate.toLocaleDateString("en-IN")}</span>
              <span className="font-semibold text-navy-900">{formatINR(invoice.totalPaise)}</span>
            </div>
            <div className="mt-3 flex items-center gap-5 border-t border-concrete-100 pt-3">
              <Link href={`/admin/invoices/${invoice.id}/print`} target="_blank" className="text-sm font-medium text-navy-700">Print</Link>
              <Link href={`/admin/invoices/${invoice.id}`} className="text-sm font-medium text-accent-600">Edit</Link>
              <DeleteInvoiceButton id={invoice.id} invoiceNumber={invoice.invoiceNumber} />
            </div>
          </div>
        ))}
        {invoices.length === 0 && <p className="py-8 text-center text-sm text-concrete-500">No invoices yet.</p>}
      </div>
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 font-mono text-xs font-medium text-navy-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-4 py-3 text-concrete-700">{invoice.partyName}</td>
                <td className="px-4 py-3 text-concrete-600">
                  {invoice.invoiceDate.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[invoice.status]}`}
                  >
                    {invoice.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-navy-900">
                  {formatINR(invoice.totalPaise)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/invoices/${invoice.id}/print`}
                      target="_blank"
                      className="text-sm font-medium text-navy-700 hover:text-navy-900"
                    >
                      Print
                    </Link>
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
                      className="text-sm font-medium text-accent-600 hover:text-accent-700"
                    >
                      Edit
                    </Link>
                    <DeleteInvoiceButton id={invoice.id} invoiceNumber={invoice.invoiceNumber} />
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-concrete-500">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
