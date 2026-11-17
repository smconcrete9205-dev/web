import type { Payment as PaymentRow, Party as PartyRow, Invoice as InvoiceRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { syncInvoiceStatus } from "@/lib/invoices";
import type { PaymentMode } from "@/lib/erpOptions";

export type PaymentDirection = "IN" | "OUT";
export { PAYMENT_MODES, type PaymentMode } from "@/lib/erpOptions";

export interface Payment {
  id: string;
  partyId: string;
  partyName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  direction: PaymentDirection;
  amountPaise: number;
  paymentDate: Date;
  mode: PaymentMode;
  reference: string;
  notes: string;
}

export interface PaymentInput {
  partyId: string;
  invoiceId: string | null;
  direction: PaymentDirection;
  amountPaise: number;
  paymentDate: Date;
  mode: PaymentMode;
  reference: string;
  notes: string;
}

type Row = PaymentRow & { party: PartyRow; invoice: InvoiceRow | null };

function toPayment(row: Row): Payment {
  return {
    id: row.id,
    partyId: row.partyId,
    partyName: row.party.name,
    invoiceId: row.invoiceId,
    invoiceNumber: row.invoice?.invoiceNumber ?? null,
    direction: row.direction as PaymentDirection,
    amountPaise: row.amountPaise,
    paymentDate: row.paymentDate,
    mode: row.mode as PaymentMode,
    reference: row.reference ?? "",
    notes: row.notes ?? "",
  };
}

const INCLUDE = { party: true, invoice: true } as const;

export async function getAllPayments(): Promise<Payment[]> {
  const rows = await prisma.payment.findMany({
    include: INCLUDE,
    orderBy: { paymentDate: "desc" },
  });
  return rows.map(toPayment);
}

export async function getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
  const rows = await prisma.payment.findMany({
    where: { invoiceId },
    include: INCLUDE,
    orderBy: { paymentDate: "asc" },
  });
  return rows.map(toPayment);
}

/** Returns an error message, or null if the payment can be recorded. */
async function validateAgainstInvoice(input: PaymentInput): Promise<string | null> {
  if (!input.invoiceId) return null;
  if (input.direction !== "IN") return "Only received payments can be linked to an invoice.";

  const invoice = await prisma.invoice.findUnique({
    where: { id: input.invoiceId },
    include: { payments: true },
  });
  if (!invoice) return "Invoice not found.";
  if (invoice.partyId !== input.partyId) return "That invoice belongs to a different customer.";
  if (invoice.status === "CANCELLED") return "This invoice is cancelled.";
  if (invoice.status === "DRAFT") return "Mark the invoice as Sent before recording a payment.";

  const paid = invoice.payments
    .filter((p) => p.direction === "IN")
    .reduce((sum, p) => sum + p.amountPaise, 0);
  const balance = invoice.totalPaise - paid;
  if (input.amountPaise > balance) {
    return `Amount is more than the invoice balance (Rs ${(balance / 100).toFixed(2)}).`;
  }
  return null;
}

export async function createPayment(
  input: PaymentInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const error = await validateAgainstInvoice(input);
  if (error) return { ok: false, error };

  await prisma.payment.create({
    data: {
      partyId: input.partyId,
      invoiceId: input.invoiceId,
      direction: input.direction,
      amountPaise: input.amountPaise,
      paymentDate: input.paymentDate,
      mode: input.mode,
      reference: input.reference || null,
      notes: input.notes || null,
    },
  });
  if (input.invoiceId) await syncInvoiceStatus(input.invoiceId);
  return { ok: true };
}

export async function deletePayment(id: string): Promise<void> {
  const row = await prisma.payment.findUnique({ where: { id }, select: { invoiceId: true } });
  await prisma.payment.delete({ where: { id } });
  if (row?.invoiceId) await syncInvoiceStatus(row.invoiceId);
}
