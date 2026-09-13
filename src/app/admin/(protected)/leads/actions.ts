"use server";

import { revalidatePath } from "next/cache";
import { updateLeadStatus, deleteLead, type LeadStatus } from "@/lib/leads";

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function removeLead(id: string): Promise<void> {
  await deleteLead(id);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
