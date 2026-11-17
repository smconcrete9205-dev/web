import Link from "next/link";
import { getAllChallans } from "@/lib/challans";
import DeleteChallanButton from "./DeleteChallanButton";

export const dynamic = "force-dynamic";

export default async function AdminChallansPage() {
  const challans = await getAllChallans();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Delivery Challans</h1>
          <p className="mt-1 text-sm text-concrete-600">
            {challans.length} deliver{challans.length === 1 ? "y" : "ies"} on record.
          </p>
        </div>
        <Link
          href="/admin/challans/new"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New Challan
        </Link>
      </div>

      <div className="mt-6 space-y-3 lg:hidden">
        {challans.map((c) => (
          <div key={c.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs font-medium text-navy-900">{c.challanNumber}</p>
              <span className="text-xs text-concrete-500">{c.challanDate.toLocaleDateString("en-IN")}</span>
            </div>
            <p className="mt-1 font-medium text-concrete-700">{c.partyName}</p>
            <p className="mt-1 text-xs text-concrete-500">
              {c.items.map((i) => `${i.quantity} ${i.unit} ${i.description}`).join(", ")}
            </p>
            <div className="mt-3 flex items-center gap-5 border-t border-concrete-100 pt-3">
              <Link href={`/admin/challans/${c.id}/print`} target="_blank" className="text-sm font-medium text-navy-700">Print</Link>
              <Link href={`/admin/challans/${c.id}`} className="text-sm font-medium text-accent-600">Edit</Link>
              <DeleteChallanButton id={c.id} number={c.challanNumber} />
            </div>
          </div>
        ))}
        {challans.length === 0 && <p className="py-8 text-center text-sm text-concrete-500">No challans yet.</p>}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Challan #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {challans.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono text-xs font-medium text-navy-900">{c.challanNumber}</td>
                <td className="px-4 py-3 text-concrete-600">{c.challanDate.toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-concrete-700">{c.partyName}</td>
                <td className="max-w-xs truncate px-4 py-3 text-concrete-600">
                  {c.items.map((i) => `${i.quantity} ${i.unit} ${i.description}`).join(", ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-concrete-600">{c.invoiceNumber ?? "—"}</td>
                <td className="px-4 py-3 text-concrete-600">{c.vehicleNo || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/challans/${c.id}/print`} target="_blank" className="text-sm font-medium text-navy-700 hover:text-navy-900">Print</Link>
                    <Link href={`/admin/challans/${c.id}`} className="text-sm font-medium text-accent-600 hover:text-accent-700">Edit</Link>
                    <DeleteChallanButton id={c.id} number={c.challanNumber} />
                  </div>
                </td>
              </tr>
            ))}
            {challans.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-concrete-500">
                  No challans yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
