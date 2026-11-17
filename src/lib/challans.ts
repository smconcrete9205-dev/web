import { Prisma } from "@prisma/client";
import type { Challan as ChallanRow, Party as PartyRow, Invoice as InvoiceRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Delivery challan: a record of goods sent to a customer (optionally tied to an invoice). */

export interface ChallanItem {
  description: string;
  quantity: number;
  unit: string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  partyId: string;
  partyName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  challanDate: Date;
  vehicleNo: string;
  driverName: string;
  deliveryAddress: string;
  items: ChallanItem[];
  notes: string;
}

export type ChallanInput = {
  partyId: string;
  invoiceId: string | null;
  challanDate: Date;
  vehicleNo: string;
  driverName: string;
  deliveryAddress: string;
  items: ChallanItem[];
  notes: string;
};

type Row = ChallanRow & { party: PartyRow; invoice: InvoiceRow | null };

function parseItems(value: string): ChallanItem[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toChallan(row: Row): Challan {
  return {
    id: row.id,
    challanNumber: row.challanNumber,
    partyId: row.partyId,
    partyName: row.party.name,
    invoiceId: row.invoiceId,
    invoiceNumber: row.invoice?.invoiceNumber ?? null,
    challanDate: row.challanDate,
    vehicleNo: row.vehicleNo ?? "",
    driverName: row.driverName ?? "",
    deliveryAddress: row.deliveryAddress ?? "",
    items: parseItems(row.items),
    notes: row.notes ?? "",
  };
}

const INCLUDE = { party: true, invoice: true } as const;

async function generateChallanNumber(): Promise<string> {
  const prefix = `CH-${new Date().getFullYear()}-`;
  const last = await prisma.challan.findFirst({
    where: { challanNumber: { startsWith: prefix } },
    orderBy: { challanNumber: "desc" },
    select: { challanNumber: true },
  });
  const lastSeq = last ? parseInt(last.challanNumber.slice(prefix.length), 10) || 0 : 0;
  return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}

export async function getAllChallans(): Promise<Challan[]> {
  const rows = await prisma.challan.findMany({
    include: INCLUDE,
    orderBy: { challanDate: "desc" },
  });
  return rows.map(toChallan);
}

export async function getChallanById(id: string): Promise<Challan | null> {
  const row = await prisma.challan.findUnique({ where: { id }, include: INCLUDE });
  return row ? toChallan(row) : null;
}

export async function createChallan(input: ChallanInput): Promise<Challan> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const challanNumber = await generateChallanNumber();
    try {
      const row = await prisma.challan.create({
        data: {
          challanNumber,
          partyId: input.partyId,
          invoiceId: input.invoiceId,
          challanDate: input.challanDate,
          vehicleNo: input.vehicleNo || null,
          driverName: input.driverName || null,
          deliveryAddress: input.deliveryAddress || null,
          items: JSON.stringify(input.items),
          notes: input.notes || null,
        },
        include: INCLUDE,
      });
      return toChallan(row);
    } catch (err) {
      const duplicate = err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!duplicate || attempt === 4) throw err;
    }
  }
  throw new Error("Could not generate a unique challan number.");
}

export async function updateChallan(id: string, input: ChallanInput): Promise<void> {
  await prisma.challan.update({
    where: { id },
    data: {
      partyId: input.partyId,
      invoiceId: input.invoiceId,
      challanDate: input.challanDate,
      vehicleNo: input.vehicleNo || null,
      driverName: input.driverName || null,
      deliveryAddress: input.deliveryAddress || null,
      items: JSON.stringify(input.items),
      notes: input.notes || null,
    },
  });
}

export async function deleteChallan(id: string): Promise<void> {
  await prisma.challan.delete({ where: { id } });
}
