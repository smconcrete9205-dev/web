import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Contact details shown across the site — header, footer, contact page,
        and WhatsApp buttons.
      </p>

      <div className="mt-6 max-w-2xl rounded-lg border border-concrete-200 bg-white p-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
