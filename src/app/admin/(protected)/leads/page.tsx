import { getAllLeads } from "@/lib/leads";
import LeadRowControls from "./LeadRowControls";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Leads</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Every quote request submitted through the site — from the homepage,
        product pages, or the contact form.
      </p>

      {leads.length === 0 ? (
        <p className="mt-6 text-sm text-concrete-500">
          No leads yet. Submissions from the site&apos;s quote/contact forms
          will show up here.
        </p>
      ) : (
        <>
<div className="mt-6 space-y-3 lg:hidden">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-navy-900">{lead.name}</p>
                <p className="shrink-0 text-xs text-concrete-500">
                  {new Date(lead.timestamp).toLocaleString("en-IN")}
                </p>
              </div>
              <a href={`tel:${lead.phone}`} className="mt-1 inline-block text-sm font-medium text-accent-600">
                {lead.phone}
              </a>
              <dl className="mt-3 space-y-1 text-sm text-concrete-700">
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">Product</dt><dd>{lead.product || "—"}</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">Qty</dt><dd>{lead.quantity || "—"}</dd></div>
                <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">Source</dt><dd className="break-all">{lead.sourcePage}</dd></div>
                {lead.message && (
                  <div className="flex gap-2"><dt className="w-16 shrink-0 text-concrete-500">Message</dt><dd>{lead.message}</dd></div>
                )}
              </dl>
              <div className="mt-3 border-t border-concrete-100 pt-3">
                <LeadRowControls id={lead.id} status={lead.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-concrete-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-concrete-500">
                    {new Date(lead.timestamp).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-900">{lead.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-concrete-700">
                    <a href={`tel:${lead.phone}`} className="hover:text-navy-700">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-concrete-700">{lead.product || "—"}</td>
                  <td className="px-4 py-3 text-concrete-700">{lead.quantity || "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-concrete-700">
                    <span className="line-clamp-2">{lead.message || "—"}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-concrete-500">
                    {lead.sourcePage}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <LeadRowControls id={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
