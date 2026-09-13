import InvoiceForm from "../InvoiceForm";
import { createInvoiceAction } from "../actions";
import { getPartiesByType } from "@/lib/parties";
import { getSiteSettings } from "@/lib/settings";

export default async function NewInvoicePage() {
  const [parties, settings] = await Promise.all([
    getPartiesByType("CUSTOMER"),
    getSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">New Invoice</h1>
      <p className="mt-1 text-sm text-concrete-600">
        GST is split automatically based on place of supply vs. our registered state (
        {settings.addressRegion || "not set — check Settings"}).
      </p>

      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        {parties.length === 0 ? (
          <p className="text-sm text-concrete-600">
            No customers yet.{" "}
            <a href="/admin/parties/new" className="font-medium text-accent-600 hover:text-accent-700">
              Add a customer first
            </a>
            .
          </p>
        ) : (
          <InvoiceForm
            parties={parties.map((p) => ({ id: p.id, name: p.name, addressRegion: p.addressRegion }))}
            businessState={settings.addressRegion}
            action={createInvoiceAction}
          />
        )}
      </div>
    </div>
  );
}
