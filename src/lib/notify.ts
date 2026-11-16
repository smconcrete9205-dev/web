import nodemailer from "nodemailer";
import type { Lead } from "@/lib/leads";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Emails a new-lead alert. Never throws: a mail failure must not lose the lead.
 * Needs SMTP_USER + SMTP_PASS (Gmail app password). No-op if not configured.
 */
export async function sendLeadEmail(lead: Lead): Promise<void> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.LEAD_NOTIFY_EMAIL || "smconcrete9205@gmail.com";
  if (!user || !pass) {
    console.warn("[Lead Email] SMTP_USER/SMTP_PASS not set — skipping email.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_PORT || "465") === "465",
      auth: { user, pass },
    });

    const rows: [string, string][] = [
      ["Name", lead.name],
      ["Phone", lead.phone],
      ["Product", lead.product || "—"],
      ["Quantity", lead.quantity || "—"],
      ["Message", lead.message || "—"],
      ["Page", lead.sourcePage],
      ["Time", lead.timestamp],
    ];

    await transporter.sendMail({
      from: `"SM Concrete Website" <${user}>`,
      to,
      subject: `New enquiry: ${lead.name} (${lead.phone})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html:
        `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">` +
        rows
          .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
          .join("") +
        `</table>`,
    });
  } catch (err) {
    console.error("[Lead Email Failed]", err);
  }
}
