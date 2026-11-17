import type { LedgerEntry } from "@/lib/ledger";
import { formatINR } from "@/lib/money";

function Balance({ paise }: { paise: number }) {
  if (paise === 0) return <span>₹0.00</span>;
  return paise > 0 ? (
    <span>{formatINR(paise)} Dr</span>
  ) : (
    <span>{formatINR(-paise)} Cr</span>
  );
}

/** Dr = party owes us, Cr = we owe the party. */
export default function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-concrete-200 bg-white print:rounded-none print:border-0">
      <table className="w-full min-w-[640px] text-left text-sm print:text-xs">
        <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Particulars</th>
            <th className="px-4 py-3">Ref</th>
            <th className="px-4 py-3 text-right">Debit</th>
            <th className="px-4 py-3 text-right">Credit</th>
            <th className="px-4 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-concrete-200">
          {entries.map((e, i) => (
            <tr key={i}>
              <td className="px-4 py-2.5 text-concrete-600">
                {e.kind === "OPENING" ? "—" : e.date.toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-2.5 text-navy-900">{e.description}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-concrete-600">{e.ref || "—"}</td>
              <td className="px-4 py-2.5 text-right text-concrete-700">
                {e.debitPaise ? formatINR(e.debitPaise) : ""}
              </td>
              <td className="px-4 py-2.5 text-right text-concrete-700">
                {e.creditPaise ? formatINR(e.creditPaise) : ""}
              </td>
              <td className="px-4 py-2.5 text-right font-medium text-navy-900">
                <Balance paise={e.balancePaise} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
