"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "smc_vid";
const SOURCE_KEY = "smc_src";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Classifies where the visit came from. Remembered for the browser session so it sticks to the first page. */
function getSource(): string {
  try {
    const saved = sessionStorage.getItem(SOURCE_KEY);
    if (saved) return saved;
  } catch {
    /* ignore */
  }

  let source = "direct";
  const utm = new URLSearchParams(window.location.search).get("utm_source");
  if (utm) {
    source = utm.toLowerCase();
  } else if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host === window.location.hostname.replace(/^www\./, "")) source = "direct";
      else if (/google\./.test(host)) source = "google";
      else if (/bing\.|yahoo\.|duckduckgo\./.test(host)) source = "other-search";
      else if (/facebook\.|instagram\.|t\.co|twitter\.|linkedin\.|youtube\.|wa\.me|whatsapp\./.test(host)) {
        source = "social";
      } else source = host;
    } catch {
      source = "other";
    }
  }
  try {
    sessionStorage.setItem(SOURCE_KEY, source);
  } catch {
    /* ignore */
  }
  return source;
}

function getDevice(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function send(type: "view" | "call" | "whatsapp", path: string) {
  const payload = JSON.stringify({
    type,
    path,
    referrer: document.referrer || undefined,
    source: getSource(),
    device: getDevice(),
    visitorId: getVisitorId(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    /* tracking must never break the page */
  }
}

/** Records page views and call / WhatsApp clicks to our own database (shown in the admin dashboard). */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    send("view", pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) send("call", window.location.pathname);
      else if (/wa\.me|whatsapp\.com/.test(href)) send("whatsapp", window.location.pathname);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
