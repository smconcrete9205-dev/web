import { getLicense, lockMessage } from "@/lib/license";
import { getSiteSettings } from "@/lib/settings";

/** Full-card lock message, shown instead of ERP forms once the licence expires. */
export async function LicensePaywall() {
  const [license, settings] = await Promise.all([getLicense(), getSiteSettings()]);
  const wa = settings.whatsappNumber.replace(/\D/g, "");
  return (
    <div className="max-w-xl rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="text-lg font-bold text-red-800">
        {license.renewalDue ? "Licence expired" : "Trial ended"}
      </h1>
      <p className="mt-2 text-sm text-red-900">{lockMessage(license)}</p>
      <p className="mt-2 text-sm text-red-900">
        Products, leads and website traffic keep working. Existing invoices can still be viewed and
        printed.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {wa && (
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi, I want to continue the yearly plan.")}`}
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Contact on WhatsApp
          </a>
        )}
        {settings.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
          >
            Call {settings.phoneDisplay}
          </a>
        )}
      </div>
    </div>
  );
}

/** Wraps a page: shows the paywall when locked, otherwise the page. */
export default async function LicenseGate({ children }: { children: React.ReactNode }) {
  const license = await getLicense();
  if (license.locked) return <LicensePaywall />;
  return <>{children}</>;
}
