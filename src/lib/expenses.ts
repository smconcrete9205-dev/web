import { prisma } from "@/lib/prisma";
import type { PaymentMode } from "@/lib/erpOptions";

export { EXPENSE_CATEGORIES } from "@/lib/erpOptions";

export interface Expense {
  id: string;
  category: string;
  description: string;
  amountPaise: number;
  expenseDate: Date;
  mode: PaymentMode;
  partyId: string | null;
  partyName: string | null;
}

export interface ExpenseInput {
  category: string;
  description: string;
  amountPaise: number;
  expenseDate: Date;
  mode: PaymentMode;
  partyId: string | null;
}

/** [start, end) of a calendar month; month is "YYYY-MM". Defaults to the current month. */
export function monthRange(month?: string): { start: Date; end: Date; key: string } {
  const match = month?.match(/^(\d{4})-(\d{2})$/);
  const now = new Date();
  const year = match ? Number(match[1]) : now.getFullYear();
  const mon = match ? Number(match[2]) - 1 : now.getMonth();
  const start = new Date(year, mon, 1);
  const end = new Date(year, mon + 1, 1);
  return { start, end, key: `${year}-${String(mon + 1).padStart(2, "0")}` };
}

export async function getExpenses(start: Date, end: Date): Promise<Expense[]> {
  const rows = await prisma.expense.findMany({
    where: { expenseDate: { gte: start, lt: end } },
    include: { party: { select: { name: true } } },
    orderBy: { expenseDate: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    description: r.description ?? "",
    amountPaise: r.amountPaise,
    expenseDate: r.expenseDate,
    mode: r.mode as PaymentMode,
    partyId: r.partyId,
    partyName: r.party?.name ?? null,
  }));
}

export async function createExpense(input: ExpenseInput): Promise<void> {
  await prisma.expense.create({
    data: {
      category: input.category,
      description: input.description || null,
      amountPaise: input.amountPaise,
      expenseDate: input.expenseDate,
      mode: input.mode,
      partyId: input.partyId,
    },
  });
}

export async function deleteExpense(id: string): Promise<void> {
  await prisma.expense.delete({ where: { id } });
}

export async function getExpenseTotal(start: Date, end: Date): Promise<number> {
  const agg = await prisma.expense.aggregate({
    where: { expenseDate: { gte: start, lt: end } },
    _sum: { amountPaise: true },
  });
  return agg._sum.amountPaise ?? 0;
}
