import { prisma } from "@/lib/prisma";

/**
 * Trial / licence state. One row (id=1), managed from /superadmin.
 * Expired => ERP writes are blocked (see `licenseLockError`); products,
 * leads, traffic and settings stay usable.
 */
const LICENSE_ID = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS) || 14;
export const DEFAULT_PRICE_INR = 3999;

export type LicenseStatus = "TRIAL" | "ACTIVE" | "EXPIRED";

export interface LicenseInfo {
  status: LicenseStatus;
  locked: boolean;
  trialEndsAt: Date;
  paidUntil: Date | null;
  /** Date the current period (trial or paid) ends. */
  endsAt: Date;
  daysLeft: number;
  priceInr: number;
  message: string;
  /** True if this was an unpaid-then-renewal-due case (paidUntil existed). */
  renewalDue: boolean;
}

export function computeLicense(row: {
  trialEndsAt: Date;
  paidUntil: Date | null;
  priceInr: number;
  message: string;
}): LicenseInfo {
  const now = Date.now();
  const paid = row.paidUntil && row.paidUntil.getTime() > now;
  const inTrial = row.trialEndsAt.getTime() > now;
  const status: LicenseStatus = paid ? "ACTIVE" : inTrial ? "TRIAL" : "EXPIRED";
  const endsAt = paid ? row.paidUntil! : row.trialEndsAt;
  return {
    status,
    locked: status === "EXPIRED",
    trialEndsAt: row.trialEndsAt,
    paidUntil: row.paidUntil,
    endsAt,
    daysLeft: Math.max(0, Math.ceil((endsAt.getTime() - now) / DAY_MS)),
    priceInr: row.priceInr,
    message: row.message,
    renewalDue: status === "EXPIRED" && !!row.paidUntil,
  };
}

/** Never throws: if the DB is unreachable we fail open (not locked). */
export async function getLicense(): Promise<LicenseInfo> {
  try {
    const row = await prisma.license.upsert({
      where: { id: LICENSE_ID },
      update: {},
      create: { id: LICENSE_ID, trialEndsAt: new Date(Date.now() + TRIAL_DAYS * DAY_MS) },
    });
    return computeLicense(row);
  } catch (err) {
    console.error("getLicense: failing open —", err);
    return computeLicense({
      trialEndsAt: new Date(Date.now() + TRIAL_DAYS * DAY_MS),
      paidUntil: null,
      priceInr: DEFAULT_PRICE_INR,
      message: "",
    });
  }
}

export function lockMessage(l: LicenseInfo): string {
  if (l.message) return l.message;
  const price = l.priceInr.toLocaleString("en-IN");
  return l.renewalDue
    ? `Your yearly licence has expired. Renew for ₹${price}/year (server charges) to continue creating invoices, payments, challans and more.`
    : `Your free trial has ended. To keep using these features, continue with the yearly plan of ₹${price}/year (server charges).`;
}

/** Use at the top of every ERP write action: `if (locked) return { error }`. */
export async function licenseLockError(): Promise<string | null> {
  const l = await getLicense();
  return l.locked ? lockMessage(l) : null;
}

export async function updateLicense(data: {
  trialEndsAt?: Date;
  paidUntil?: Date | null;
  priceInr?: number;
  message?: string;
}): Promise<void> {
  await getLicense(); // ensure the row exists
  await prisma.license.update({ where: { id: LICENSE_ID }, data });
}
