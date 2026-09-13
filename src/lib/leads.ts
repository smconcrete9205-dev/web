import { prisma } from "@/lib/prisma";

/**
 * Central lead-capture module.
 *
 * ERP INTEGRATION POINT: when you're ready to connect the real ERP/CRM, this is the
 * ONLY file you need to change. `saveLead` currently persists to the local database
 * (so leads show up in /admin/leads). Add your ERP call alongside (or instead of)
 * the database write and keep the function signature the same — every form and
 * API route in the app already calls this function and does not know or care how
 * leads are persisted.
 */

export interface Lead {
  name: string;
  phone: string;
  /** Product name the enquiry relates to. Empty string for general enquiries (e.g. /contact). */
  product: string;
  quantity: string;
  message: string;
  /** Path of the page the enquiry form was submitted from, e.g. "/products/rcc-spun-pipe". */
  sourcePage: string;
  /** ISO 8601 timestamp of when the lead was submitted. */
  timestamp: string;
}

export type LeadStatus = "new" | "contacted" | "closed";

export interface LeadRecord extends Lead {
  id: string;
  status: LeadStatus;
}

export interface SaveLeadResult {
  success: boolean;
  error?: string;
}

/**
 * Persists a lead to the database and logs it to the server console.
 *
 * TODO(erp-integration): add a call to the ERP API here as well, e.g.:
 *
 *   await fetch(process.env.ERP_LEADS_ENDPOINT!, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ERP_API_KEY}` },
 *     body: JSON.stringify(leadData),
 *   });
 */
export async function saveLead(leadData: Lead): Promise<SaveLeadResult> {
  console.log("[Lead Received]", JSON.stringify(leadData, null, 2));

  try {
    await prisma.lead.create({
      data: {
        name: leadData.name,
        phone: leadData.phone,
        product: leadData.product,
        quantity: leadData.quantity,
        message: leadData.message,
        sourcePage: leadData.sourcePage,
      },
    });
    return { success: true };
  } catch (err) {
    console.error("[Lead Save Failed]", err);
    return { success: false, error: "Failed to save lead." };
  }
}

/** Used by the admin panel (/admin/leads) — not part of the public form flow. */
export async function getAllLeads(): Promise<LeadRecord[]> {
  const rows = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    product: row.product,
    quantity: row.quantity,
    message: row.message,
    sourcePage: row.sourcePage,
    status: row.status as LeadStatus,
    timestamp: row.createdAt.toISOString(),
  }));
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await prisma.lead.update({ where: { id }, data: { status } });
}

export async function deleteLead(id: string): Promise<void> {
  await prisma.lead.delete({ where: { id } });
}
