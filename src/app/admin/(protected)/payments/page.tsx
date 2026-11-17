import Link from "next/link";
import { getAllPayments } from "@/lib/payments";
import { formatINR } from "@/lib/money";
import DeletePaymentButton from "./DeletePaymentButton";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();
  const totalIn = payments.filter((p) => p.direction === "IN").reduce((s, p) => s + p.amountPaise, 0);
  const totalOut = payments.filter((p) => p.direction === "OUT").reduce((s, p) => s + p.amountPaise, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Payments</h1>
          <p className="mt-1 text-sm text-concrete-600">
            Received {formatINR(totalIn)} · Paid out {formatINR(totalOut)}
          </p>
        </div>
        <Link
          href="/admin/payments/new"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + Record Payment
        </Link>
      </div>

      <div className="mt-6 space-y-3 lg:hidden">
        {payments.map((p) => (
          <div key={p.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-navy-900">{p.partyName}</p>
              <span className={`font-semibold ${p.direction === "IN" ? "text-green-700" : "text-red-600"}`}>
                {p.direction === "IN" ? "+" : "−"}
                {formatINR(p.amountPaise)}
              </span>
            </div>
            <p className="mt-1 text-xs text-concrete-500">
              {p.paymentDate.toLocaleDateString("en-IN")} · {p.mode}
              {p.invoiceNumber ? ` · ${p.invoiceNumber}` : ""}
              {p.reference ? ` · ${p.reference}` : ""}
            </p>
            <div className="mt-3 border-t border-concrete-100 pt-3">
              <DeletePaymentButton id={p.id} />
            </div>
          </div>
        ))}
        {payments.length === 0 && <p className="py-8 text-center text-sm text-concrete-500">No payments yet.</p>}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-concrete-600">{p.paymentDate.toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 font-medium text-navy-900">{p.partyName}</td>
                <td className="px-4 py-3 font-mono text-xs text-concrete-600">{p.invoiceNumber ?? "—"}</td>
                <td className="px-4 py-3 text-concrete-600">{p.mode}</td>
                <td className="px-4 py-3 text-concrete-600">{p.reference || "—"}</td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    p.direction === "IN" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {p.direction === "IN" ? "+" : "−"}
                  {formatINR(p.amountPaise)}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeletePaymentButton id={p.id} />
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-concrete-500">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
