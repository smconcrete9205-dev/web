import { notFound } from "next/navigation";
import { getPartyLedger } from "@/lib/ledger";
import { getSiteSettings } from "@/lib/settings";
import { COMPANY } from "@/lib/constants";
import { formatINR } from "@/lib/money";
import PrintButton from "../../../../invoices/[id]/print/PrintButton";
import LedgerTable from "../../../../(protected)/parties/LedgerTable";

export const dynamic = "force-dynamic";

export default async function PartyLedgerPrintPage({ params }: { params: { id: string } }) {
  const [ledger, settings] = await Promise.all([getPartyLedger(params.id), getSiteSettings()]);
  if (!ledger) notFound();
  const { party, entries, closingBalancePaise } = ledger;

  return (
    <div className="min-h-screen bg-concrete-100 py-8 print:bg-white print:py-0">
      <PrintButton />
      <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm print:max-w-none print:p-6 print:shadow-none">
        <div className="border-b border-concrete-300 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="SM Concrete Products" className="mb-2 h-14 w-auto" style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />
          <h1 className="text-xl font-bold text-navy-900">{COMPANY.legalName}</h1>
          <p className="mt-1 text-xs text-concrete-600">
            {settings.addressStreet}, {settings.addressLocality}, {settings.addressRegion}{" "}
            {settings.addressPostalCode} · Phone: {settings.phoneDisplay}
          </p>
          {settings.gstin && <p className="text-xs font-semibold text-navy-900">GSTIN: {settings.gstin}</p>}
        </div>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-concrete-500">Account Statement</p>
            <p className="mt-1 font-semibold text-navy-900">{party.name}</p>
            {party.gstin && <p className="text-xs text-concrete-600">GSTIN: {party.gstin}</p>}
            <p className="text-xs text-concrete-600">Phone: {party.phone}</p>
          </div>
          <p className="text-xs text-concrete-600">As on {new Date().toLocaleDateString("en-IN")}</p>
        </div>

        <div className="mt-4">
          <LedgerTable entries={entries} />
        </div>

        <p className="mt-4 text-right text-sm font-bold text-navy-900">
          Closing balance: {formatINR(Math.abs(closingBalancePaise))}{" "}
          {closingBalancePaise > 0 ? "Dr (receivable)" : closingBalancePaise < 0 ? "Cr (payable)" : ""}
        </p>
        <p className="mt-6 text-center text-[10px] text-concrete-400">
          Dr = amount due from party · Cr = amount due to party. Computer-generated statement.
        </p>
      </div>
    </div>
  );
}
