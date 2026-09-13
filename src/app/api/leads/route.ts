import { NextRequest, NextResponse } from "next/server";
import { saveLead, type Lead } from "@/lib/leads";

interface LeadRequestBody {
  name?: string;
  phone?: string;
  product?: string;
  quantity?: string;
  message?: string;
  sourcePage?: string;
}

export async function POST(request: NextRequest) {
  let body: LeadRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json(
      { success: false, error: "Name and phone are required." },
      { status: 400 }
    );
  }

  const lead: Lead = {
    name,
    phone,
    product: (body.product ?? "").trim(),
    quantity: (body.quantity ?? "").trim(),
    message: (body.message ?? "").trim(),
    sourcePage: (body.sourcePage ?? "unknown").trim(),
    timestamp: new Date().toISOString(),
  };

  const result = await saveLead(lead);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error ?? "Failed to save lead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
