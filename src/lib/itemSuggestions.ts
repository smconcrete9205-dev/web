import { prisma } from "@/lib/prisma";

/** A catalog product offered in the invoice/challan item picker, with defaults learned from past invoices. */
export interface ItemSuggestion {
  name: string;
  hsnCode: string;
  unit: string;
  /** Rate per unit in rupees from the most recent invoice using this item (0 if never invoiced). */
  rate: number;
  gstRate: number;
}

const DEFAULT_HSN = "6810"; // articles of cement / concrete
const DEFAULT_GST = 18;

/**
 * Catalog products (plus any other item names used on past invoices), each
 * prefilled with its billing defaults (HSN / unit / rate / GST).
 */
export async function getItemSuggestions(): Promise<ItemSuggestion[]> {
  const [products, invoices] = await Promise.all([
    prisma.product.findMany({
      select: { name: true, hsnCode: true, unit: true, gstRate: true, ratePaise: true },
      orderBy: { name: "asc" },
    }),
    prisma.invoice.findMany({
      select: { items: true },
      orderBy: { invoiceDate: "desc" },
      take: 200,
    }),
  ]);

  const latest = new Map<string, ItemSuggestion>();
  for (const inv of invoices) {
    let items: unknown;
    try {
      items = JSON.parse(inv.items);
    } catch {
      continue;
    }
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      const name = String(it?.description ?? "").trim();
      if (!name || latest.has(name.toLowerCase())) continue; // first seen = most recent
      latest.set(name.toLowerCase(), {
        name,
        hsnCode: String(it.hsnCode ?? "") || DEFAULT_HSN,
        unit: String(it.unit ?? "") || "Nos",
        rate: Number(it.rate) || 0,
        gstRate: Number.isFinite(Number(it.gstRate)) ? Number(it.gstRate) : DEFAULT_GST,
      });
    }
  }

  const result = new Map<string, ItemSuggestion>();
  for (const p of products) {
    const past = latest.get(p.name.toLowerCase());
    result.set(p.name.toLowerCase(), {
      name: p.name,
      // The product master is the source of truth; a past invoice only fills in a missing rate.
      hsnCode: p.hsnCode || DEFAULT_HSN,
      unit: p.unit || "Nos",
      gstRate: p.gstRate,
      rate: p.ratePaise > 0 ? p.ratePaise / 100 : (past?.rate ?? 0),
    });
  }
  // Keep previously invoiced custom items selectable too.
  latest.forEach((s, key) => {
    if (!result.has(key)) result.set(key, s);
  });

  return Array.from(result.values());
}
