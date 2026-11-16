import Link from "next/link";
import { getAllParties } from "@/lib/parties";
import { formatINR } from "@/lib/money";
import DeletePartyButton from "./DeletePartyButton";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  CUSTOMER: "Customer",
  VENDOR: "Vendor",
  BOTH: "Both",
};

export default async function AdminPartiesPage() {
  const parties = await getAllParties();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Parties</h1>
          <p className="mt-1 text-sm text-concrete-600">
            {parties.length} customer{parties.length === 1 ? "" : "s"}/vendors on record.
          </p>
        </div>
        <Link
          href="/admin/parties/new"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + Add Party
        </Link>
      </div>

      <div className="mt-6 space-y-3 lg:hidden">
        {parties.map((party) => (
          <div key={party.id} className={`rounded-lg border border-concrete-200 bg-white p-4 shadow-sm ${party.isActive ? "" : "opacity-50"}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-navy-900">{party.name}</p>
              <span className="shrink-0 rounded-full bg-concrete-100 px-2 py-0.5 text-xs text-concrete-600">{TYPE_LABEL[party.type]}</span>
            </div>
            <a href={`tel:${party.phone}`} className="mt-1 inline-block text-sm font-medium text-accent-600">{party.phone}</a>
            <dl className="mt-2 space-y-1 text-sm text-concrete-700">
              <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">GSTIN</dt><dd className="font-mono text-xs">{party.gstin || "—"}</dd></div>
              <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">State</dt><dd>{party.addressRegion || "—"}</dd></div>
              <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">Balance</dt><dd>{formatINR(Math.round(party.openingBalance * 100))}</dd></div>
            </dl>
            <div className="mt-3 flex items-center gap-5 border-t border-concrete-100 pt-3">
              <Link href={`/admin/parties/${party.id}`} className="text-sm font-medium text-accent-600">Edit</Link>
              <DeletePartyButton id={party.id} name={party.name} />
            </div>
          </div>
        ))}
        {parties.length === 0 && <p className="py-8 text-center text-sm text-concrete-500">No parties yet. Add your first customer or vendor.</p>}
      </div>
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">GSTIN</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3 text-right">Opening Balance</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {parties.map((party) => (
              <tr key={party.id} className={party.isActive ? "" : "opacity-50"}>
                <td className="px-4 py-3 font-medium text-navy-900">{party.name}</td>
                <td className="px-4 py-3 text-concrete-600">{TYPE_LABEL[party.type]}</td>
                <td className="px-4 py-3 text-concrete-600">{party.phone}</td>
                <td className="px-4 py-3 font-mono text-xs text-concrete-500">
                  {party.gstin || "—"}
                </td>
                <td className="px-4 py-3 text-concrete-600">{party.addressRegion || "—"}</td>
                <td className="px-4 py-3 text-right text-concrete-600">
                  {formatINR(Math.round(party.openingBalance * 100))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/parties/${party.id}`}
                      className="text-sm font-medium text-accent-600 hover:text-accent-700"
                    >
                      Edit
                    </Link>
                    <DeletePartyButton id={party.id} name={party.name} />
                  </div>
                </td>
              </tr>
            ))}
            {parties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-concrete-500">
                  No parties yet. Add your first customer or vendor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
