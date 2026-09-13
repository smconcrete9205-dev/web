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
        <div className="mt-6 overflow-x-auto rounded-lg border border-concrete-200 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
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
      )}
    </div>
  );
}
