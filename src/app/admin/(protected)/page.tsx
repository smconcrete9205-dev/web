import Link from "next/link";
import { getAllLeads } from "@/lib/leads";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-concrete-200 bg-white p-6 shadow-sm hover:border-navy-300"
    >
      <p className="text-sm font-medium text-concrete-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [leads, products] = await Promise.all([getAllLeads(), getAllProducts()]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const recentLeads = leads.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Overview of leads and product catalog.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Leads" value={leads.length} href="/admin/leads" />
        <StatCard label="New Leads" value={newLeads} href="/admin/leads" />
        <StatCard label="Products" value={products.length} href="/admin/products" />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            View all →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="mt-4 text-sm text-concrete-500">No leads yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-concrete-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete-200">
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-3 font-medium text-navy-900">{lead.name}</td>
                    <td className="px-4 py-3 text-concrete-700">{lead.phone}</td>
                    <td className="px-4 py-3 text-concrete-700">{lead.product || "—"}</td>
                    <td className="px-4 py-3 capitalize text-concrete-700">{lead.status}</td>
                    <td className="px-4 py-3 text-concrete-500">
                      {new Date(lead.timestamp).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
