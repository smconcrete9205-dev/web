import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

/**
 * Handles image uploads from the admin product form. Protected by
 * middleware (see src/middleware.ts) AND re-checked here, since this route
 * writes files to disk — more sensitive than a read-only admin page.
 *
 * Saves into public/images/products/, which only works on deployments with a
 * persistent filesystem (self-hosted/VPS) — same constraint as the SQLite
 * database. On serverless platforms, swap this for an upload to S3/Cloudinary/
 * Vercel Blob and return that URL instead.
 */

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  // SVG deliberately excluded — an uploaded SVG can carry a <script>, and
  // next.config.js already allows SVG rendering for the site's own logo files.
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  const isValid = secret ? await verifySessionToken(token, secret) : false;
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Only JPG, PNG, and WEBP images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "products");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ path: `/images/products/${filename}` });
}
