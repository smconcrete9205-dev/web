import { Prisma } from "@prisma/client";
import type { Invoice as InvoiceRow, Party as PartyRow, Payment as PaymentRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rupeesToPaise } from "@/lib/money";

/**
 * GST sales invoice data access layer — backed by the database and managed
 * through the admin panel at /admin/invoices.
 *
 * GST is split as CGST+SGST when the invoice's place of supply matches our
 * own registered state (intra-state supply), or as IGST when it doesn't
 * (inter-state supply) — see computeInvoiceTotals().
 */

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  /** Rate per unit, in rupees. */
  rate: number;
  /** GST rate as a percentage, e.g. 18. */
  gstRate: number;
}

export interface InvoiceTotals {
  subtotalPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalPaise: number;
}

export interface Invoice extends InvoiceTotals {
  /** Received (IN) payments linked to this invoice, in paise. */
  paidPaise: number;
  /** totalPaise - paidPaise (never below 0). */
  balancePaise: number;
  id: string;
  invoiceNumber: string;
  partyId: string;
  partyName: string;
  invoiceDate: Date;
  dueDate: Date | null;
  items: InvoiceItem[];
  placeOfSupply: string;
  status: InvoiceStatus;
  notes: string;
  createdAt: Date;
}

export type InvoiceInput = {
  partyId: string;
  invoiceDate: Date;
  dueDate: Date | null;
  items: InvoiceItem[];
  placeOfSupply: string;
  status: InvoiceStatus;
  notes: string;
};

type InvoiceRowWithParty = InvoiceRow & { party: PartyRow; payments: PaymentRow[] };

const INCLUDE = { party: true, payments: true } as const;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseItems(value: string): InvoiceItem[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toInvoice(row: InvoiceRowWithParty): Invoice {
  const paidPaise = row.payments
    .filter((p) => p.direction === "IN")
    .reduce((sum, p) => sum + p.amountPaise, 0);
  let status = row.status as InvoiceStatus;
  // Past-due unpaid invoices show as OVERDUE automatically.
  if (
    (status === "SENT" || status === "PARTIALLY_PAID") &&
    row.dueDate &&
    row.dueDate < startOfToday()
  ) {
    status = "OVERDUE";
  }
  return {
    paidPaise,
    balancePaise: Math.max(0, row.totalPaise - paidPaise),
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    partyId: row.partyId,
    partyName: row.party.name,
    invoiceDate: row.invoiceDate,
    dueDate: row.dueDate,
    items: parseItems(row.items),
    placeOfSupply: row.placeOfSupply,
    subtotalPaise: row.subtotalPaise,
    cgstPaise: row.cgstPaise,
    sgstPaise: row.sgstPaise,
    igstPaise: row.igstPaise,
    totalPaise: row.totalPaise,
    status,
    notes: row.notes ?? "",
    createdAt: row.createdAt,
  };
}

/**
 * Computes subtotal/GST/total in paise from invoice line items.
 * businessState is our own registered state (SiteSettings.addressRegion);
 * same state as placeOfSupply => CGST+SGST split, otherwise => IGST.
 */
export function computeInvoiceTotals(
  items: InvoiceItem[],
  businessState: string,
  placeOfSupply: string
): InvoiceTotals {
  let subtotalPaise = 0;
  let gstPaise = 0;

  for (const item of items) {
    const lineSubtotalPaise = rupeesToPaise(item.quantity * item.rate);
    subtotalPaise += lineSubtotalPaise;
    gstPaise += Math.round(lineSubtotalPaise * (item.gstRate / 100));
  }

  const isIntraState =
    Boolean(businessState) &&
    Boolean(placeOfSupply) &&
    businessState.trim().toLowerCase() === placeOfSupply.trim().toLowerCase();

  if (isIntraState) {
    const cgstPaise = Math.round(gstPaise / 2);
    return {
      subtotalPaise,
      cgstPaise,
      sgstPaise: gstPaise - cgstPaise,
      igstPaise: 0,
      totalPaise: subtotalPaise + gstPaise,
    };
  }

  return {
    subtotalPaise,
    cgstPaise: 0,
    sgstPaise: 0,
    igstPaise: gstPaise,
    totalPaise: subtotalPaise + gstPaise,
  };
}

/**
 * Generates the next invoice number for the current calendar year, e.g.
 * INV-2026-0001. Based on the highest existing number (not a row count), so
 * deleting an invoice can never cause a duplicate.
 */
export async function generateInvoiceNumber(): Promise<string> {
  const prefix = `INV-${new Date().getFullYear()}-`;
  const last = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });
  const lastSeq = last ? parseInt(last.invoiceNumber.slice(prefix.length), 10) || 0 : 0;
  return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    include: INCLUDE,
    orderBy: { invoiceDate: "desc" },
  });
  return rows.map(toInvoice);
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const row = await prisma.invoice.findUnique({ where: { id }, include: INCLUDE });
  return row ? toInvoice(row) : null;
}

export async function getInvoicesByParty(partyId: string): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    where: { partyId },
    include: INCLUDE,
    orderBy: { invoiceDate: "desc" },
  });
  return rows.map(toInvoice);
}

export async function createInvoice(
  input: InvoiceInput,
  businessState: string
): Promise<Invoice> {
  const totals = computeInvoiceTotals(input.items, businessState, input.placeOfSupply);

  // Retry if two invoices race for the same number (unique constraint).
  for (let attempt = 0; attempt < 5; attempt++) {
    const invoiceNumber = await generateInvoiceNumber();
    try {
      const row = await prisma.invoice.create({
        data: {
          invoiceNumber,
          partyId: input.partyId,
          invoiceDate: input.invoiceDate,
          dueDate: input.dueDate,
          items: JSON.stringify(input.items),
          placeOfSupply: input.placeOfSupply,
          status: input.status,
          notes: input.notes || null,
          ...totals,
        },
        include: INCLUDE,
      });
      return toInvoice(row);
    } catch (err) {
      const duplicate =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!duplicate || attempt === 4) throw err;
    }
  }
  throw new Error("Could not generate a unique invoice number.");
}

export async function updateInvoice(
  id: string,
  input: InvoiceInput,
  businessState: string
): Promise<Invoice> {
  const totals = computeInvoiceTotals(input.items, businessState, input.placeOfSupply);

  const row = await prisma.invoice.update({
    where: { id },
    data: {
      partyId: input.partyId,
      invoiceDate: input.invoiceDate,
      dueDate: input.dueDate,
      items: JSON.stringify(input.items),
      placeOfSupply: input.placeOfSupply,
      status: input.status,
      notes: input.notes || null,
      ...totals,
    },
    include: INCLUDE,
  });
  await syncInvoiceStatus(id);
  return toInvoice(row);
}

/**
 * Re-derives PAID / PARTIALLY_PAID / SENT from the invoice's received
 * payments. DRAFT and CANCELLED invoices are left alone. (OVERDUE is not
 * stored — it is derived from the due date when reading.)
 */
export async function syncInvoiceStatus(invoiceId: string): Promise<void> {
  const row = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!row || row.status === "DRAFT" || row.status === "CANCELLED") return;

  const paid = row.payments
    .filter((p) => p.direction === "IN")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  let next: InvoiceStatus = "SENT";
  if (paid > 0 && paid >= row.totalPaise) next = "PAID";
  else if (paid > 0) next = "PARTIALLY_PAID";

  if (next !== row.status) {
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: next } });
  }
}

/** Marks an invoice cancelled (GST-friendly: the number is kept, not deleted). */
export async function cancelInvoice(id: string): Promise<void> {
  await prisma.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
}

/**
 * Only DRAFT invoices (never issued) may be deleted. Issued invoices must be
 * cancelled instead so the invoice number sequence stays intact.
 */
export async function deleteInvoice(id: string): Promise<{ ok: boolean; error?: string }> {
  const row = await prisma.invoice.findUnique({ where: { id }, select: { status: true } });
  if (!row) return { ok: true };
  if (row.status !== "DRAFT") {
    return { ok: false, error: "Issued invoices can't be deleted — cancel the invoice instead." };
  }
  await prisma.invoice.delete({ where: { id } });
  return { ok: true };
}
