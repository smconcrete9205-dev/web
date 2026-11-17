import { getAllParties } from "@/lib/parties";
import { getAllInvoices } from "@/lib/invoices";
import PaymentForm from "../PaymentForm";
import { createPaymentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: { invoiceId?: string };
}) {
  const [parties, invoices] = await Promise.all([getAllParties(), getAllInvoices()]);
  const openInvoices = invoices
    .filter((i) => i.status !== "DRAFT" && i.status !== "CANCELLED" && i.balancePaise > 0)
    .map((i) => ({
      id: i.id,
      partyId: i.partyId,
      number: i.invoiceNumber,
      balanceRupees: i.balancePaise / 100,
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Record Payment</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Money received from a customer, or paid to a vendor.
      </p>
      <div className="mt-6 max-w-3xl rounded-lg border border-concrete-200 bg-white p-6">
        <PaymentForm
          parties={parties.filter((p) => p.isActive).map((p) => ({ id: p.id, name: p.name }))}
          openInvoices={openInvoices}
          defaultInvoiceId={searchParams.invoiceId}
          action={createPaymentAction}
        />
      </div>
    </div>
  );
}
