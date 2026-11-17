import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";
import { getReceivablePayable } from "@/lib/ledger";
import { getExpenseTotal, monthRange } from "@/lib/expenses";
import { getTrafficSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number | string;
  href: string;
  tone?: "good" | "bad";
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-concrete-200 bg-white p-6 shadow-sm hover:border-navy-300"
    >
      <p className="text-sm font-medium text-concrete-500">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          tone === "good" ? "text-green-700" : tone === "bad" ? "text-red-600" : "text-navy-900"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { start, end } = monthRange();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalLeads,
    newLeads,
    productCount,
    recentRows,
    monthSales,
    monthExpenses,
    overdue,
    balances,
    traffic,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.product.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: start, lt: end }, status: { notIn: ["DRAFT", "CANCELLED"] } },
      _sum: { subtotalPaise: true },
      _count: true,
    }),
    getExpenseTotal(start, end),
    prisma.invoice.findMany({
      where: { status: { in: ["SENT", "PARTIALLY_PAID"] }, dueDate: { lt: today } },
      select: { totalPaise: true, payments: { select: { amountPaise: true, direction: true } } },
    }),
    getReceivablePayable(),
    getTrafficSummary(7),
  ]);
  const overduePaise = overdue.reduce(
    (sum, inv) =>
      sum +
      Math.max(
        0,
        inv.totalPaise -
          inv.payments.filter((p) => p.direction === "IN").reduce((s, p) => s + p.amountPaise, 0)
      ),
    0
  );
  const salesPaise = monthSales._sum.subtotalPaise ?? 0;
  const recentLeads = recentRows.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    product: r.product,
    status: r.status,
    timestamp: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Overview of leads, business and website traffic.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Leads" value={totalLeads} href="/admin/leads" />
        <StatCard label="New Leads" value={newLeads} href="/admin/leads" />
        <StatCard label="Products" value={productCount} href="/admin/products" />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-navy-900">Business — this month</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={`Sales (${monthSales._count} invoices)`} value={formatINR(salesPaise)} href="/admin/reports" />
        <StatCard label="Expenses" value={formatINR(monthExpenses)} href="/admin/expenses" />
        <StatCard
          label="Profit (sales − expenses)"
          value={formatINR(salesPaise - monthExpenses)}
          href="/admin/reports"
          tone={salesPaise - monthExpenses >= 0 ? "good" : "bad"}
        />
        <StatCard label="To receive (all parties)" value={formatINR(balances.receivablePaise)} href="/admin/parties" tone="good" />
        <StatCard label="To pay (vendors)" value={formatINR(balances.payablePaise)} href="/admin/parties" />
        <StatCard
          label={`Overdue (${overdue.length} invoices)`}
          value={formatINR(overduePaise)}
          href="/admin/invoices"
          tone={overduePaise > 0 ? "bad" : undefined}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Website — last 7 days</h2>
        <Link href="/admin/analytics" className="text-sm font-medium text-accent-600 hover:text-accent-700">
          Full traffic report →
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Visitors" value={traffic.visitors} href="/admin/analytics" />
        <StatCard label="Page views" value={traffic.views} href="/admin/analytics" />
        <StatCard label="Call + WhatsApp clicks" value={traffic.calls + traffic.whatsapp} href="/admin/analytics" />
        <StatCard label="Visitor → lead" value={`${traffic.conversionPct}%`} href="/admin/analytics" />
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
          <>
<div className="mt-4 space-y-3 lg:hidden">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-navy-900">{lead.name}</p>
                  <span className="shrink-0 text-xs capitalize text-concrete-600">{lead.status}</span>
                </div>
                <a href={`tel:${lead.phone}`} className="text-sm font-medium text-accent-600">{lead.phone}</a>
                <p className="mt-1 text-sm text-concrete-700">{lead.product || "—"}</p>
                <p className="mt-1 text-xs text-concrete-500">{new Date(lead.timestamp).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
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
        </>
        )}
      </div>
    </div>
  );
}
