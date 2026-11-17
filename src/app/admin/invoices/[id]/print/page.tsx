import { notFound } from "next/navigation";
import { getInvoiceById } from "@/lib/invoices";
import { getPartyById } from "@/lib/parties";
import { getSiteSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/constants";
import { formatINR, rupeesToWords, paiseToRupees } from "@/lib/money";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) notFound();

  const [party, settings] = await Promise.all([
    getPartyById(invoice.partyId),
    getSiteSettings(),
  ]);

  const isIntraState = invoice.cgstPaise > 0 || invoice.sgstPaise > 0;

  return (
    <div className="min-h-screen bg-concrete-100 py-8 print:bg-white print:py-0">
      <PrintButton />

      <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm print:max-w-none print:p-6 print:shadow-none">
        <div className="flex items-start justify-between border-b border-concrete-300 pb-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="SM Concrete Products" className="mb-2 h-14 w-auto" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />
            <h1 className="text-xl font-bold text-navy-900">{COMPANY.legalName}</h1>
            <p className="mt-1 text-xs text-concrete-600">
              {settings.addressStreet}, {settings.addressLocality}, {settings.addressRegion}{" "}
              {settings.addressPostalCode}
            </p>
            <p className="text-xs text-concrete-600">
              Phone: {settings.phoneDisplay} · Email: {settings.email}
            </p>
            {settings.gstin && (
              <p className="mt-1 text-xs font-semibold text-navy-900">GSTIN: {settings.gstin}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase tracking-wide text-navy-900">Tax Invoice</h2>
            <p className="mt-1 font-mono text-sm text-concrete-700">{invoice.invoiceNumber}</p>
            <p className="text-xs text-concrete-600">
              Date: {invoice.invoiceDate.toLocaleDateString("en-IN")}
            </p>
            {invoice.dueDate && (
              <p className="text-xs text-concrete-600">
                Due: {invoice.dueDate.toLocaleDateString("en-IN")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6 border-b border-concrete-300 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Bill To</p>
            <p className="mt-1 font-semibold text-navy-900">{party?.name}</p>
            {party?.addressStreet && <p className="text-xs text-concrete-600">{party.addressStreet}</p>}
            <p className="text-xs text-concrete-600">
              {[party?.addressLocality, party?.addressRegion, party?.addressPostalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
            {party?.gstin && (
              <p className="mt-1 text-xs font-semibold text-navy-900">GSTIN: {party.gstin}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">
              Place of Supply
            </p>
            <p className="mt-1 text-sm text-concrete-700">{invoice.placeOfSupply}</p>
          </div>
        </div>

        <table className="mt-4 w-full text-left text-xs">
          <thead className="border-b border-concrete-300 uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Description</th>
              <th className="py-2">HSN</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">GST%</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-100">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2 text-concrete-500">{i + 1}</td>
                <td className="py-2 text-navy-900">
                  {item.description}
                  <span className="text-concrete-500"> ({item.unit})</span>
                </td>
                <td className="py-2 font-mono text-concrete-600">{item.hsnCode || "—"}</td>
                <td className="py-2 text-right text-concrete-700">{item.quantity}</td>
                <td className="py-2 text-right text-concrete-700">{item.rate.toFixed(2)}</td>
                <td className="py-2 text-right text-concrete-700">{item.gstRate}%</td>
                <td className="py-2 text-right font-medium text-navy-900">
                  {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-concrete-700">
              <span>Subtotal</span>
              <span>{formatINR(invoice.subtotalPaise)}</span>
            </div>
            {isIntraState ? (
              <>
                <div className="flex justify-between text-concrete-700">
                  <span>CGST</span>
                  <span>{formatINR(invoice.cgstPaise)}</span>
                </div>
                <div className="flex justify-between text-concrete-700">
                  <span>SGST</span>
                  <span>{formatINR(invoice.sgstPaise)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-concrete-700">
                <span>IGST</span>
                <span>{formatINR(invoice.igstPaise)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-concrete-300 pt-1 text-base font-bold text-navy-900">
              <span>Total</span>
              <span>{formatINR(invoice.totalPaise)}</span>
            </div>
            {invoice.paidPaise > 0 && (
              <>
                <div className="flex justify-between text-concrete-700">
                  <span>Received</span>
                  <span>{formatINR(invoice.paidPaise)}</span>
                </div>
                <div className="flex justify-between font-semibold text-navy-900">
                  <span>Balance Due</span>
                  <span>{formatINR(invoice.balancePaise)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs italic text-concrete-600">
          Amount in words: {rupeesToWords(paiseToRupees(invoice.totalPaise))}
        </p>

        {invoice.notes && (
          <div className="mt-4 border-t border-concrete-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Notes</p>
            <p className="mt-1 text-xs text-concrete-700">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <div className="text-center text-xs text-concrete-600">
            <p>For {COMPANY.legalName}</p>
            <p className="mt-12">Authorised Signatory</p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-concrete-400">
          This is a computer-generated invoice.
        </p>
      </div>
    </div>
  );
}
