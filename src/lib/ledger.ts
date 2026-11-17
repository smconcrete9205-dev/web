import { prisma } from "@/lib/prisma";

/**
 * Party ledger. Balance sign convention (paise):
 *   positive = party owes us (receivable), negative = we owe the party (payable).
 *
 *   opening balance         +/-  as entered on the party
 *   invoice (issued)        +    total
 *   payment received (IN)   -    amount
 *   payment made (OUT)      +    amount   (we paid down what we owed them)
 *
 * DRAFT and CANCELLED invoices don't count.
 */

export interface LedgerEntry {
  date: Date;
  kind: "OPENING" | "INVOICE" | "PAYMENT_IN" | "PAYMENT_OUT";
  ref: string;
  description: string;
  /** Amount that increases the party's balance (they owe us more). */
  debitPaise: number;
  /** Amount that decreases the party's balance. */
  creditPaise: number;
  balancePaise: number;
}

export async function getPartyLedger(partyId: string) {
  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party) return null;

  const [invoices, payments] = await Promise.all([
    prisma.invoice.findMany({
      where: { partyId, status: { notIn: ["DRAFT", "CANCELLED"] } },
      orderBy: { invoiceDate: "asc" },
    }),
    prisma.payment.findMany({
      where: { partyId },
      include: { invoice: { select: { invoiceNumber: true } } },
      orderBy: { paymentDate: "asc" },
    }),
  ]);

  type Raw = Omit<LedgerEntry, "balancePaise">;
  const raw: Raw[] = [
    ...invoices.map<Raw>((i) => ({
      date: i.invoiceDate,
      kind: "INVOICE",
      ref: i.invoiceNumber,
      description: "Tax invoice",
      debitPaise: i.totalPaise,
      creditPaise: 0,
    })),
    ...payments.map<Raw>((p) =>
      p.direction === "IN"
        ? {
            date: p.paymentDate,
            kind: "PAYMENT_IN",
            ref: p.reference || p.mode,
            description: `Payment received (${p.mode})${p.invoice ? ` - ${p.invoice.invoiceNumber}` : ""}`,
            debitPaise: 0,
            creditPaise: p.amountPaise,
          }
        : {
            date: p.paymentDate,
            kind: "PAYMENT_OUT",
            ref: p.reference || p.mode,
            description: `Payment made (${p.mode})`,
            debitPaise: p.amountPaise,
            creditPaise: 0,
          }
    ),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  let balance = party.openingBalancePaise;
  const entries: LedgerEntry[] = [
    {
      date: party.createdAt,
      kind: "OPENING",
      ref: "",
      description: "Opening balance",
      debitPaise: Math.max(0, party.openingBalancePaise),
      creditPaise: Math.max(0, -party.openingBalancePaise),
      balancePaise: balance,
    },
  ];
  for (const r of raw) {
    balance += r.debitPaise - r.creditPaise;
    entries.push({ ...r, balancePaise: balance });
  }

  return { party, entries, closingBalancePaise: balance };
}

/** Current balance of every party, keyed by party id (see sign convention above). */
export async function getAllPartyBalances(): Promise<Map<string, number>> {
  const [parties, invoiceSums, paymentSums] = await Promise.all([
    prisma.party.findMany({ select: { id: true, openingBalancePaise: true } }),
    prisma.invoice.groupBy({
      by: ["partyId"],
      where: { status: { notIn: ["DRAFT", "CANCELLED"] } },
      _sum: { totalPaise: true },
    }),
    prisma.payment.groupBy({
      by: ["partyId", "direction"],
      _sum: { amountPaise: true },
    }),
  ]);

  const balances = new Map<string, number>();
  for (const p of parties) balances.set(p.id, p.openingBalancePaise);
  for (const i of invoiceSums) {
    balances.set(i.partyId, (balances.get(i.partyId) ?? 0) + (i._sum.totalPaise ?? 0));
  }
  for (const p of paymentSums) {
    const amount = p._sum.amountPaise ?? 0;
    balances.set(p.partyId, (balances.get(p.partyId) ?? 0) + (p.direction === "IN" ? -amount : amount));
  }
  return balances;
}

/** Totals receivable (parties who owe us) and payable (we owe parties). */
export async function getReceivablePayable() {
  const balances = await getAllPartyBalances();
  let receivablePaise = 0;
  let payablePaise = 0;
  balances.forEach((b) => {
    if (b > 0) receivablePaise += b;
    else payablePaise += -b;
  });
  return { receivablePaise, payablePaise };
}
