"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SUPERADMIN_COOKIE_NAME, superSecret } from "@/lib/session";

export interface SuperLoginState {
  error?: string;
}

export async function superLogin(
  _prev: SuperLoginState,
  formData: FormData
): Promise<SuperLoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const u = process.env.SUPERADMIN_USERNAME;
  const p = process.env.SUPERADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!u || !p || !secret) return { error: "Superadmin credentials are not configured." };
  if (username !== u || password !== p) return { error: "Invalid username or password." };

  const token = await createSessionToken(username, superSecret(secret));
  cookies().set(SUPERADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/superadmin");
}

export async function superLogout(): Promise<void> {
  cookies().delete(SUPERADMIN_COOKIE_NAME);
  redirect("/superadmin/login");
}
