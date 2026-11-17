import { prisma } from "@/lib/prisma";

export type EventType = "view" | "call" | "whatsapp";

export interface TrafficSummary {
  days: number;
  views: number;
  visitors: number;
  calls: number;
  whatsapp: number;
  leads: number;
  /** leads / visitors, as a percentage (0 if no visitors). */
  conversionPct: number;
  topPages: { path: string; views: number }[];
  sources: { source: string; visitors: number }[];
  devices: { device: string; visitors: number }[];
  /** One entry per day, oldest first. */
  daily: { date: string; views: number; visitors: number }[];
}

function dayKey(d: Date): string {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in server-local time
}

function topN(map: Map<string, number>, n: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

export async function getTrafficSummary(days: number): Promise<TrafficSummary> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const [events, leads] = await Promise.all([
    prisma.siteEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { type: true, path: true, source: true, device: true, visitorId: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 100_000,
    }),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
  ]);

  const visitors = new Set<string>();
  const pageViews = new Map<string, number>();
  const sourceVisitors = new Map<string, Set<string>>();
  const deviceVisitors = new Map<string, Set<string>>();
  const daily = new Map<string, { views: number; visitors: Set<string> }>();
  let views = 0;
  let calls = 0;
  let whatsapp = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    daily.set(dayKey(d), { views: 0, visitors: new Set() });
  }

  for (const e of events) {
    const vid = e.visitorId ?? `anon-${e.createdAt.getTime()}`;
    if (e.type === "call") calls++;
    else if (e.type === "whatsapp") whatsapp++;
    else if (e.type === "view") {
      views++;
      visitors.add(vid);
      pageViews.set(e.path, (pageViews.get(e.path) ?? 0) + 1);
      const day = daily.get(dayKey(e.createdAt));
      if (day) {
        day.views++;
        day.visitors.add(vid);
      }
      const src = e.source || "direct";
      if (!sourceVisitors.has(src)) sourceVisitors.set(src, new Set());
      sourceVisitors.get(src)!.add(vid);
      const dev = e.device || "unknown";
      if (!deviceVisitors.has(dev)) deviceVisitors.set(dev, new Set());
      deviceVisitors.get(dev)!.add(vid);
    }
  }

  return {
    days,
    views,
    visitors: visitors.size,
    calls,
    whatsapp,
    leads,
    conversionPct: visitors.size ? Math.round((leads / visitors.size) * 1000) / 10 : 0,
    topPages: topN(pageViews, 10).map(([path, v]) => ({ path, views: v })),
    sources: Array.from(sourceVisitors.entries())
      .map(([source, set]) => ({ source, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 8),
    devices: Array.from(deviceVisitors.entries())
      .map(([device, set]) => ({ device, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors),
    daily: Array.from(daily.entries()).map(([date, v]) => ({
      date,
      views: v.views,
      visitors: v.visitors.size,
    })),
  };
}
