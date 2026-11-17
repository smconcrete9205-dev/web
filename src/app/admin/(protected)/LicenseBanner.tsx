import { getLicense, lockMessage } from "@/lib/license";

export default async function LicenseBanner() {
  const l = await getLicense();
  if (l.status === "EXPIRED") {
    return (
      <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        <strong>{l.renewalDue ? "Licence expired." : "Trial ended."}</strong> {lockMessage(l)}
      </div>
    );
  }
  if (l.status === "TRIAL" || l.daysLeft <= 14) {
    const what = l.status === "TRIAL" ? "Free trial" : "Licence";
    return (
      <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {what} ends in <strong>{l.daysLeft} day{l.daysLeft === 1 ? "" : "s"}</strong>. After that,
        invoices, payments, challans and other ERP entries get locked (₹
        {l.priceInr.toLocaleString("en-IN")}/year to continue).
      </div>
    );
  }
  return null;
}
