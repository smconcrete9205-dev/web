import type { Invoice as InvoiceRow, Party as PartyRow } from "@prisma/client";
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

type InvoiceRowWithParty = InvoiceRow & { party: PartyRow };

function parseItems(value: string): InvoiceItem[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toInvoice(row: InvoiceRowWithParty): Invoice {
  return {
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
    status: row.status as InvoiceStatus,
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

/** Generates the next sequential invoice number for the current calendar year, e.g. INV-2026-0001. */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: { invoiceNumber: { startsWith: `INV-${year}-` } },
  });
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    include: { party: true },
    orderBy: { invoiceDate: "desc" },
  });
  return rows.map(toInvoice);
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const row = await prisma.invoice.findUnique({ where: { id }, include: { party: true } });
  return row ? toInvoice(row) : null;
}

export async function getInvoicesByParty(partyId: string): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    where: { partyId },
    include: { party: true },
    orderBy: { invoiceDate: "desc" },
  });
  return rows.map(toInvoice);
}

export async function createInvoice(
  input: InvoiceInput,
  businessState: string
): Promise<Invoice> {
  const invoiceNumber = await generateInvoiceNumber();
  const totals = computeInvoiceTotals(input.items, businessState, input.placeOfSupply);

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
    include: { party: true },
  });
  return toInvoice(row);
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
    include: { party: true },
  });
  return toInvoice(row);
}

export async function deleteInvoice(id: string): Promise<void> {
  await prisma.invoice.delete({ where: { id } });
}
