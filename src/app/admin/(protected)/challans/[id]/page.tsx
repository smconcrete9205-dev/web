import { notFound } from "next/navigation";
import Link from "next/link";
import { getChallanById } from "@/lib/challans";
import { getPartiesByType } from "@/lib/parties";
import { getAllInvoices } from "@/lib/invoices";
import { getItemSuggestions } from "@/lib/itemSuggestions";
import ChallanForm from "../ChallanForm";
import { updateChallanAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditChallanPage({ params }: { params: { id: string } }) {
  const [challan, parties, invoices, suggestions] = await Promise.all([
    getChallanById(params.id),
    getPartiesByType("CUSTOMER"),
    getAllInvoices(),
    getItemSuggestions(),
  ]);
  if (!challan) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Challan</h1>
          <p className="mt-1 text-sm text-concrete-600">{challan.challanNumber}</p>
        </div>
        <Link
          href={`/admin/challans/${challan.id}/print`}
          target="_blank"
          className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
        >
          Print / PDF
        </Link>
      </div>
      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        <ChallanForm
          challan={challan}
          parties={parties.map((p) => ({ id: p.id, name: p.name }))}
          invoices={invoices
            .filter((i) => i.status !== "CANCELLED")
            .map((i) => ({
              id: i.id,
              partyId: i.partyId,
              number: i.invoiceNumber,
              items: i.items.map((it) => ({
                description: it.description,
                quantity: it.quantity,
                unit: it.unit,
              })),
            }))}
          suggestions={suggestions}
          action={updateChallanAction.bind(null, challan.id)}
        />
      </div>
    </div>
  );
}
