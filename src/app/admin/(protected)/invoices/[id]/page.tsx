import { notFound } from "next/navigation";
import Link from "next/link";
import { getInvoiceById } from "@/lib/invoices";
import { getPartiesByType } from "@/lib/parties";
import { getSiteSettings } from "@/lib/settings";
import InvoiceForm from "../InvoiceForm";
import { updateInvoiceAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, parties, settings] = await Promise.all([
    getInvoiceById(params.id),
    getPartiesByType("CUSTOMER"),
    getSiteSettings(),
  ]);
  if (!invoice) notFound();

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit Invoice</h1>
          <p className="mt-1 text-sm text-concrete-600">{invoice.invoiceNumber}</p>
        </div>
        <Link
          href={`/admin/invoices/${invoice.id}/print`}
          target="_blank"
          className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
        >
          Print / PDF
        </Link>
      </div>

      <div className="mt-6 max-w-4xl rounded-lg border border-concrete-200 bg-white p-6">
        <InvoiceForm
          invoice={invoice}
          parties={parties.map((p) => ({ id: p.id, name: p.name, addressRegion: p.addressRegion }))}
          businessState={settings.addressRegion}
          action={action}
        />
      </div>
    </div>
  );
}
