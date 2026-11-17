import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartyLedger } from "@/lib/ledger";
import { formatINR } from "@/lib/money";
import LedgerTable from "../../LedgerTable";

export const dynamic = "force-dynamic";

export default async function PartyLedgerPage({ params }: { params: { id: string } }) {
  const ledger = await getPartyLedger(params.id);
  if (!ledger) notFound();
  const { party, entries, closingBalancePaise } = ledger;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{party.name}</h1>
          <p className="mt-1 text-sm text-concrete-600">Account statement</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/payments/new`}
            className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
          >
            + Payment
          </Link>
          <Link
            href={`/admin/parties/${party.id}/ledger/print`}
            target="_blank"
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Print / PDF
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-concrete-200 bg-white p-5">
        <p className="text-sm text-concrete-500">Current balance</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            closingBalancePaise > 0 ? "text-green-700" : closingBalancePaise < 0 ? "text-red-600" : "text-navy-900"
          }`}
        >
          {formatINR(Math.abs(closingBalancePaise))}
          <span className="ml-2 text-sm font-medium text-concrete-600">
            {closingBalancePaise > 0
              ? "to receive from party"
              : closingBalancePaise < 0
                ? "to pay to party"
                : "settled"}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <LedgerTable entries={entries} />
      </div>
    </div>
  );
}
