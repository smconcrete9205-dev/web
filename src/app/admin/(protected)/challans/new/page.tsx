import { getPartiesByType } from "@/lib/parties";
import { getAllInvoices } from "@/lib/invoices";
import { getItemSuggestions } from "@/lib/itemSuggestions";
import ChallanForm from "../ChallanForm";
import { createChallanAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewChallanPage({
  searchParams,
}: {
  searchParams: { invoiceId?: string };
}) {
  const [parties, invoices, suggestions] = await Promise.all([
    getPartiesByType("CUSTOMER"),
    getAllInvoices(),
    getItemSuggestions(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">New Delivery Challan</h1>
      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        <ChallanForm
          parties={parties.filter((p) => p.isActive).map((p) => ({ id: p.id, name: p.name }))}
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
          defaultInvoiceId={searchParams.invoiceId}
          suggestions={suggestions}
          action={createChallanAction}
        />
      </div>
    </div>
  );
}
