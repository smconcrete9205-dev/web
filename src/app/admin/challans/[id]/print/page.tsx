import { notFound } from "next/navigation";
import { getChallanById } from "@/lib/challans";
import { getPartyById } from "@/lib/parties";
import { getSiteSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/constants";
import PrintButton from "../../../invoices/[id]/print/PrintButton";

export const dynamic = "force-dynamic";

export default async function ChallanPrintPage({ params }: { params: { id: string } }) {
  const challan = await getChallanById(params.id);
  if (!challan) notFound();
  const [party, settings] = await Promise.all([getPartyById(challan.partyId), getSiteSettings()]);

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
            <h2 className="text-lg font-bold uppercase tracking-wide text-navy-900">Delivery Challan</h2>
            <p className="mt-1 font-mono text-sm text-concrete-700">{challan.challanNumber}</p>
            <p className="text-xs text-concrete-600">Date: {challan.challanDate.toLocaleDateString("en-IN")}</p>
            {challan.invoiceNumber && (
              <p className="text-xs text-concrete-600">Invoice: {challan.invoiceNumber}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6 border-b border-concrete-300 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Deliver To</p>
            <p className="mt-1 font-semibold text-navy-900">{party?.name}</p>
            <p className="text-xs text-concrete-600">
              {challan.deliveryAddress ||
                [party?.addressStreet, party?.addressLocality, party?.addressRegion, party?.addressPostalCode]
                  .filter(Boolean)
                  .join(", ")}
            </p>
            {party?.phone && <p className="text-xs text-concrete-600">Phone: {party.phone}</p>}
          </div>
          <div className="text-right text-xs text-concrete-700">
            <p>
              <span className="text-concrete-500">Vehicle No: </span>
              {challan.vehicleNo || "—"}
            </p>
            <p className="mt-1">
              <span className="text-concrete-500">Driver: </span>
              {challan.driverName || "—"}
            </p>
          </div>
        </div>

        <table className="mt-4 w-full text-left text-sm">
          <thead className="border-b border-concrete-300 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-100">
            {challan.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2 text-concrete-500">{i + 1}</td>
                <td className="py-2 text-navy-900">{item.description}</td>
                <td className="py-2 text-right text-concrete-700">{item.quantity}</td>
                <td className="py-2 text-right text-concrete-700">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {challan.notes && (
          <div className="mt-4 border-t border-concrete-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Notes</p>
            <p className="mt-1 text-xs text-concrete-700">{challan.notes}</p>
          </div>
        )}

        <p className="mt-6 text-xs text-concrete-600">
          Goods received in good condition.
        </p>
        <div className="mt-10 flex justify-between text-center text-xs text-concrete-600">
          <div>
            <p className="mt-12 border-t border-concrete-300 pt-1">Receiver&apos;s Signature</p>
          </div>
          <div>
            <p>For {COMPANY.legalName}</p>
            <p className="mt-12 border-t border-concrete-300 pt-1">Authorised Signatory</p>
          </div>
        </div>
        <p className="mt-8 text-center text-[10px] text-concrete-400">
          This is a delivery challan. Not a tax invoice.
        </p>
      </div>
    </div>
  );
}
