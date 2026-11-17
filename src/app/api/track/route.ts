import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TYPES = new Set(["view", "call", "whatsapp"]);
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|axios/i;

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string" || !value) return null;
  return value.slice(0, max);
}

/** First-party analytics beacon. Never fails loudly — tracking must not affect the site. */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

    const body = await request.json();
    const type = String(body?.type ?? "");
    const path = clip(body?.path, 300);
    if (!TYPES.has(type) || !path || !path.startsWith("/") || path.startsWith("/admin")) {
      return new NextResponse(null, { status: 204 });
    }

    await prisma.siteEvent.create({
      data: {
        type,
        path,
        referrer: clip(body?.referrer, 300),
        source: clip(body?.source, 60),
        device: ["mobile", "desktop", "tablet"].includes(body?.device) ? body.device : null,
        visitorId: clip(body?.visitorId, 64),
      },
    });
  } catch {
    // swallow — analytics is best-effort
  }
  return new NextResponse(null, { status: 204 });
}
