import Link from "next/link";
import { getTrafficSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90];

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-concrete-200 bg-white p-4">
      <p className="text-xs text-concrete-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-concrete-400">{hint}</p>}
    </div>
  );
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: { days?: string } }) {
  const requested = Number(searchParams.days);
  const days = RANGES.includes(requested) ? requested : 30;
  const t = await getTrafficSummary(days);
  const maxViews = Math.max(1, ...t.daily.map((d) => d.views));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Website Traffic</h1>
          <p className="mt-1 text-sm text-concrete-600">
            Visitors, sources and enquiry clicks — last {days} days. Tracking started when this feature went live,
            so older days will be empty.
          </p>
        </div>
        <div className="flex gap-1 rounded-md border border-concrete-300 bg-white p-1 text-sm">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/analytics?days=${r}`}
              className={`rounded px-3 py-1 font-medium ${
                r === days ? "bg-navy-900 text-white" : "text-navy-900 hover:bg-concrete-100"
              }`}
            >
              {r}d
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Visitors" value={t.visitors} hint="unique browsers" />
        <Stat label="Page views" value={t.views} />
        <Stat label="Call clicks" value={t.calls} />
        <Stat label="WhatsApp clicks" value={t.whatsapp} />
        <Stat label="Quote leads" value={t.leads} />
        <Stat label="Visitor → lead" value={`${t.conversionPct}%`} />
      </div>

      <div className="mt-8 rounded-lg border border-concrete-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-navy-900">Daily page views</h2>
        <div className="mt-4 flex h-32 items-end gap-0.5">
          {t.daily.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.views} views, ${d.visitors} visitors`}
              className="flex-1 rounded-t bg-accent-500/80"
              style={{ height: `${Math.max(2, (d.views / maxViews) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-concrete-400">
          <span>{t.daily[0]?.date}</span>
          <span>{t.daily[t.daily.length - 1]?.date}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-concrete-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-navy-900">Top pages</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {t.topPages.map((p) => (
              <li key={p.path} className="flex justify-between gap-3">
                <span className="truncate text-concrete-600">{p.path}</span>
                <span className="font-medium text-navy-900">{p.views}</span>
              </li>
            ))}
            {t.topPages.length === 0 && <li className="text-concrete-500">No data yet.</li>}
          </ul>
        </div>
        <div className="rounded-lg border border-concrete-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">Where visitors come from</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {t.sources.map((s) => (
              <li key={s.source} className="flex justify-between gap-3">
                <span className="truncate capitalize text-concrete-600">{s.source}</span>
                <span className="font-medium text-navy-900">{s.visitors}</span>
              </li>
            ))}
            {t.sources.length === 0 && <li className="text-concrete-500">No data yet.</li>}
          </ul>
        </div>
        <div className="rounded-lg border border-concrete-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-navy-900">Devices</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {t.devices.map((d) => (
              <li key={d.device} className="flex justify-between gap-3">
                <span className="capitalize text-concrete-600">{d.device}</span>
                <span className="font-medium text-navy-900">{d.visitors}</span>
              </li>
            ))}
            {t.devices.length === 0 && <li className="text-concrete-500">No data yet.</li>}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-xs text-concrete-400">
        Counts are approximate: a visitor is one browser (stored locally), bots are filtered, and visitors who block
        scripts or clear storage may be counted again.
      </p>
    </div>
  );
}
