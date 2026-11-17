"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLicense, updateLicense } from "@/lib/license";
import { SUPERADMIN_COOKIE_NAME, superSecret, verifySessionToken } from "@/lib/session";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Server actions are public endpoints, so re-check the superadmin cookie here. */
async function requireSuper(): Promise<void> {
  const secret = process.env.SESSION_SECRET;
  const token = cookies().get(SUPERADMIN_COOKIE_NAME)?.value;
  if (!secret || !(await verifySessionToken(token, superSecret(secret)))) {
    redirect("/superadmin/login");
  }
}

function done() {
  revalidatePath("/superadmin");
  revalidatePath("/admin", "layout");
}

export async function extendTrialAction(formData: FormData): Promise<void> {
  await requireSuper();
  const days = Math.max(1, Math.min(365, Number(formData.get("days")) || 7));
  const l = await getLicense();
  const base = Math.max(Date.now(), l.trialEndsAt.getTime());
  await updateLicense({ trialEndsAt: new Date(base + days * DAY_MS) });
  done();
}

/** Payment received: +1 year from today, or from current expiry if renewing early. */
export async function markPaidAction(): Promise<void> {
  await requireSuper();
  const l = await getLicense();
  const base = Math.max(Date.now(), l.paidUntil?.getTime() ?? 0);
  await updateLicense({ paidUntil: new Date(base + 365 * DAY_MS) });
  done();
}

export async function lockNowAction(): Promise<void> {
  await requireSuper();
  await updateLicense({ trialEndsAt: new Date(Date.now() - 1000), paidUntil: null });
  done();
}

export async function saveLicenseAction(formData: FormData): Promise<void> {
  await requireSuper();
  const parseDate = (k: string) => {
    const v = String(formData.get(k) ?? "");
    return v ? new Date(`${v}T23:59:59+05:30`) : null;
  };
  const trialEndsAt = parseDate("trialEndsAt");
  const price = Math.round(Number(formData.get("priceInr")));
  await updateLicense({
    ...(trialEndsAt ? { trialEndsAt } : {}),
    paidUntil: parseDate("paidUntil"),
    ...(price > 0 ? { priceInr: price } : {}),
    message: String(formData.get("message") ?? "").trim().slice(0, 500),
  });
  done();
}
