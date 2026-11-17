/**
 * Minimal signed-cookie session for the admin panel.
 *
 * Deliberately dependency-free and built on the Web Crypto API (`crypto.subtle`)
 * so the exact same code runs in both the Node.js runtime (server actions) and
 * the Edge runtime (middleware) — Next.js 14 middleware cannot use Node-only
 * APIs like the `crypto` module or bcrypt.
 *
 * This is intentionally simple (HMAC-signed payload, single admin user via env
 * vars). For a production deployment with multiple admins or stronger
 * requirements, swap this for a real auth provider (NextAuth, Clerk, etc.) —
 * the rest of the app only depends on `verifySessionToken` / `createSessionToken`.
 */

export const SESSION_COOKIE_NAME = "smcp_admin_session";
export const SUPERADMIN_COOKIE_NAME = "smcp_super_session";
/** Superadmin tokens use a derived secret so an admin cookie can never pass as superadmin. */
export const superSecret = (secret: string) => `${secret}:superadmin`;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface SessionPayload {
  u: string; // username
  exp: number; // expiry, ms since epoch
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecodeToString(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + pad);
}

async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64UrlEncode(signature);
}

export async function createSessionToken(username: string, secret: string): Promise<string> {
  const payload: SessionPayload = { u: username, exp: Date.now() + SESSION_TTL_MS };
  const payloadStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(payloadStr, secret);
  return `${payloadStr}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [payloadStr, signature] = token.split(".");
  if (!payloadStr || !signature) return false;

  const expectedSignature = await sign(payloadStr, secret);
  if (expectedSignature !== signature) return false;

  try {
    const payload = JSON.parse(base64UrlDecodeToString(payloadStr)) as SessionPayload;
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
