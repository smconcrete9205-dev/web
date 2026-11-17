import { getExpenses, monthRange } from "@/lib/expenses";
import { getPartiesByType } from "@/lib/parties";
import { formatINR } from "@/lib/money";
import ExpenseForm from "./ExpenseForm";
import DeleteExpenseButton from "./DeleteExpenseButton";
import { inputClass } from "../formStyles";

export const dynamic = "force-dynamic";

export default async function AdminExpensesPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const { start, end, key } = monthRange(searchParams.month);
  const [expenses, vendors] = await Promise.all([getExpenses(start, end), getPartiesByType("VENDOR")]);

  const total = expenses.reduce((s, e) => s + e.amountPaise, 0);
  const byCategory = new Map<string, number>();
  for (const e of expenses) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amountPaise);
  const categories = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Expenses</h1>
          <p className="mt-1 text-sm text-concrete-600">
            {expenses.length} entr{expenses.length === 1 ? "y" : "ies"} · Total {formatINR(total)}
          </p>
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

      <div className="mt-6 rounded-lg border border-concrete-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-navy-900">Add expense</h2>
        <ExpenseForm vendors={vendors.map((v) => ({ id: v.id, name: v.name }))} />
      </div>

      {categories.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map(([cat, paise]) => (
            <div key={cat} className="rounded-lg border border-concrete-200 bg-white p-3">
              <p className="text-xs text-concrete-500">{cat}</p>
              <p className="mt-1 font-semibold text-navy-900">{formatINR(paise)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-concrete-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 text-concrete-600">{e.expenseDate.toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 font-medium text-navy-900">{e.category}</td>
                <td className="px-4 py-3 text-concrete-600">
                  {e.description || "—"}
                  {e.partyName ? <span className="text-concrete-400"> · {e.partyName}</span> : null}
                </td>
                <td className="px-4 py-3 text-concrete-600">{e.mode}</td>
                <td className="px-4 py-3 text-right font-medium text-navy-900">{formatINR(e.amountPaise)}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteExpenseButton id={e.id} />
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-concrete-500">
                  No expenses for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
