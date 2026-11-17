import type { Metadata } from "next";
import { getLicense } from "@/lib/license";
import { superLogout } from "./login/actions";
import {
  extendTrialAction,
  lockNowAction,
  markPaidAction,
  saveLicenseAction,
} from "./actions";

export const metadata: Metadata = { title: "Superadmin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ymd = (d: Date | null) =>
  d ? new Date(d.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10) : "";
const input =
  "mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";
const btn = "rounded-md px-4 py-2 text-sm font-semibold text-white";

export default async function SuperadminPage() {
  const l = await getLicense();
  const badge =
    l.status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : l.status === "TRIAL"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";

  return (
    <div className="min-h-screen bg-concrete-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-900">Licence control</h1>
          <form action={superLogout}>
            <button className="text-sm font-medium text-concrete-600 hover:text-navy-900">
              Log out
            </button>
          </form>
        </div>

        <section className="rounded-lg border border-concrete-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge}`}>{l.status}</span>
            <span className="text-sm text-concrete-700">
              {l.status === "EXPIRED"
                ? "ERP writes are locked"
                : `${l.daysLeft} day(s) left · ends ${ymd(l.endsAt)}`}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-concrete-500">Trial ends</dt>
              <dd className="font-medium text-navy-900">{ymd(l.trialEndsAt)}</dd>
            </div>
            <div>
              <dt className="text-concrete-500">Paid until</dt>
              <dd className="font-medium text-navy-900">{ymd(l.paidUntil) || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-concrete-200 bg-white p-6">
          <h2 className="font-semibold text-navy-900">Quick actions</h2>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <form action={markPaidAction}>
              <button className={`${btn} bg-green-600 hover:bg-green-700`}>Mark paid (+1 year)</button>
            </form>
            <form action={extendTrialAction} className="flex items-end gap-2">
              <label className="text-sm text-concrete-600">
                Extend trial (days)
                <input name="days" type="number" min={1} max={365} defaultValue={7} className={`${input} w-24`} />
              </label>
              <button className={`${btn} bg-navy-900 hover:bg-navy-800`}>Extend</button>
            </form>
            <form action={lockNowAction}>
              <button className={`${btn} bg-red-600 hover:bg-red-700`}>Lock now</button>
            </form>
          </div>
        </section>

        <form action={saveLicenseAction} className="space-y-4 rounded-lg border border-concrete-200 bg-white p-6">
          <h2 className="font-semibold text-navy-900">Manual edit</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm text-concrete-600">
              Trial ends
              <input name="trialEndsAt" type="date" defaultValue={ymd(l.trialEndsAt)} className={input} />
            </label>
            <label className="text-sm text-concrete-600">
              Paid until (blank = unpaid)
              <input name="paidUntil" type="date" defaultValue={ymd(l.paidUntil)} className={input} />
            </label>
            <label className="text-sm text-concrete-600">
              Price ₹/year
              <input name="priceInr" type="number" min={1} defaultValue={l.priceInr} className={input} />
            </label>
          </div>
          <label className="block text-sm text-concrete-600">
            Custom lock message (blank = default)
            <textarea name="message" rows={3} defaultValue={l.message} className={input} />
          </label>
          <button className={`${btn} bg-accent-500 hover:bg-accent-600`}>Save</button>
        </form>
      </div>
    </div>
  );
}
