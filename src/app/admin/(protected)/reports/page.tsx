import { prisma } from "@/lib/prisma";
import { monthRange } from "@/lib/expenses";
import { formatINR } from "@/lib/money";
import { inputClass } from "../formStyles";

export const dynamic = "force-dynamic";

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-lg border border-concrete-200 bg-white p-4">
      <p className="text-xs text-concrete-500">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          tone === "good" ? "text-green-700" : tone === "bad" ? "text-red-600" : "text-navy-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function AdminReportsPage({ searchParams }: { searchParams: { month?: string } }) {
  const { start, end, key } = monthRange(searchParams.month);

  const [invoices, expenseRows, payments] = await Promise.all([
    prisma.invoice.findMany({
      where: { invoiceDate: { gte: start, lt: end }, status: { notIn: ["DRAFT", "CANCELLED"] } },
      include: { party: { select: { name: true } } },
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: { expenseDate: { gte: start, lt: end } },
      _sum: { amountPaise: true },
    }),
    prisma.payment.groupBy({
      by: ["direction"],
      where: { paymentDate: { gte: start, lt: end } },
      _sum: { amountPaise: true },
    }),
  ]);

  const sum = (f: (i: (typeof invoices)[number]) => number) => invoices.reduce((s, i) => s + f(i), 0);
  const taxable = sum((i) => i.subtotalPaise);
  const cgst = sum((i) => i.cgstPaise);
  const sgst = sum((i) => i.sgstPaise);
  const igst = sum((i) => i.igstPaise);
  const billed = sum((i) => i.totalPaise);
  const expenses = expenseRows.reduce((s, e) => s + (e._sum.amountPaise ?? 0), 0);
  const received = payments.find((p) => p.direction === "IN")?._sum.amountPaise ?? 0;
  const paidOut = payments.find((p) => p.direction === "OUT")?._sum.amountPaise ?? 0;
  const profit = taxable - expenses;
  const cashflow = received - paidOut - expenses;

  const byParty = new Map<string, number>();
  for (const i of invoices) byParty.set(i.party.name, (byParty.get(i.party.name) ?? 0) + i.totalPaise);
  const topParties = Array.from(byParty.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
          <p className="mt-1 text-sm text-concrete-600">Monthly summary — sales, GST, expenses and profit.</p>
        </div>
        <form method="get" className="flex items-center gap-2">
          <input type="month" name="month" defaultValue={key} className={`${inputClass} w-44`} />
          <button
            type="submit"
            className="rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
          >
            Show
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={`Sales (taxable) · ${invoices.length} invoices`} value={formatINR(taxable)} />
        <Stat label="Expenses" value={formatINR(expenses)} />
        <Stat label="Profit (taxable sales − expenses)" value={formatINR(profit)} tone={profit >= 0 ? "good" : "bad"} />
        <Stat label="Total billed (incl. GST)" value={formatINR(billed)} />
        <Stat label="Payments received" value={formatINR(received)} tone="good" />
        <Stat label="Paid to vendors" value={formatINR(paidOut)} />
        <Stat label="Net cash flow" value={formatINR(cashflow)} tone={cashflow >= 0 ? "good" : "bad"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-concrete-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">GST collected (for filing)</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-concrete-600">Taxable value</dt><dd>{formatINR(taxable)}</dd></div>
            <div className="flex justify-between"><dt className="text-concrete-600">CGST</dt><dd>{formatINR(cgst)}</dd></div>
            <div className="flex justify-between"><dt className="text-concrete-600">SGST</dt><dd>{formatINR(sgst)}</dd></div>
            <div className="flex justify-between"><dt className="text-concrete-600">IGST</dt><dd>{formatINR(igst)}</dd></div>
            <div className="flex justify-between border-t border-concrete-200 pt-2 font-semibold text-navy-900">
              <dt>Total GST</dt>
              <dd>{formatINR(cgst + sgst + igst)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-concrete-500">
            Output GST only. Input tax credit on purchases is not tracked here.
          </p>
        </div>

        <div className="rounded-lg border border-concrete-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">Expenses by category</h2>
          {expenseRows.length === 0 ? (
            <p className="mt-3 text-sm text-concrete-500">No expenses this month.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {expenseRows
                .sort((a, b) => (b._sum.amountPaise ?? 0) - (a._sum.amountPaise ?? 0))
                .map((e) => (
                  <li key={e.category} className="flex justify-between">
                    <span className="text-concrete-600">{e.category}</span>
                    <span>{formatINR(e._sum.amountPaise ?? 0)}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-concrete-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-navy-900">Top customers this month</h2>
        {topParties.length === 0 ? (
          <p className="mt-3 text-sm text-concrete-500">No invoices this month.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {topParties.map(([name, paise]) => (
              <li key={name} className="flex justify-between">
                <span className="text-concrete-600">{name}</span>
                <span>{formatINR(paise)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
