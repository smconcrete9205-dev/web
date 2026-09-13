import type { Party as PartyRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Party (customer/vendor) data access layer — backed by the database and
 * managed through the admin panel at /admin/parties. Invoices, purchase
 * orders, and payments all reference a party by id.
 */

export type PartyType = "CUSTOMER" | "VENDOR" | "BOTH";

export interface Party {
  id: string;
  type: PartyType;
  name: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  addressStreet: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  /** Ledger opening balance in rupees. Positive = party owes us, negative = we owe party. */
  openingBalance: number;
  notes: string;
  isActive: boolean;
  createdAt: Date;
}

export type PartyInput = Omit<Party, "id" | "createdAt">;

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    type: row.type as PartyType,
    name: row.name,
    gstin: row.gstin ?? "",
    pan: row.pan ?? "",
    phone: row.phone,
    email: row.email ?? "",
    addressStreet: row.addressStreet ?? "",
    addressLocality: row.addressLocality ?? "",
    addressRegion: row.addressRegion ?? "",
    addressPostalCode: row.addressPostalCode ?? "",
    openingBalance: row.openingBalancePaise / 100,
    notes: row.notes ?? "",
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

function toRowData(input: PartyInput) {
  return {
    type: input.type,
    name: input.name,
    gstin: input.gstin || null,
    pan: input.pan || null,
    phone: input.phone,
    email: input.email || null,
    addressStreet: input.addressStreet || null,
    addressLocality: input.addressLocality || null,
    addressRegion: input.addressRegion || null,
    addressPostalCode: input.addressPostalCode || null,
    openingBalancePaise: Math.round(input.openingBalance * 100),
    notes: input.notes || null,
    isActive: input.isActive,
  };
}

export async function getAllParties(): Promise<Party[]> {
  const rows = await prisma.party.findMany({ orderBy: { name: "asc" } });
  return rows.map(toParty);
}

export async function getPartiesByType(type: PartyType | "ALL"): Promise<Party[]> {
  const all = await getAllParties();
  if (type === "ALL") return all;
  return all.filter((p) => p.type === type || p.type === "BOTH");
}

export async function getPartyById(id: string): Promise<Party | null> {
  const row = await prisma.party.findUnique({ where: { id } });
  return row ? toParty(row) : null;
}

export async function createParty(input: PartyInput): Promise<Party> {
  const row = await prisma.party.create({ data: toRowData(input) });
  return toParty(row);
}

export async function updateParty(id: string, input: PartyInput): Promise<Party> {
  const row = await prisma.party.update({ where: { id }, data: toRowData(input) });
  return toParty(row);
}

export async function deleteParty(id: string): Promise<void> {
  await prisma.party.delete({ where: { id } });
}
