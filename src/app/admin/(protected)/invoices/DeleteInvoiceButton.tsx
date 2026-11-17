"use client";

import { ConfirmActionButton } from "../FormUi";
import { deleteInvoiceAction, cancelInvoiceAction } from "./actions";

/** Drafts can be deleted; issued invoices can only be cancelled (keeps GST numbering intact). */
export default function DeleteInvoiceButton({
  id,
  invoiceNumber,
  status,
}: {
  id: string;
  invoiceNumber: string;
  status: string;
}) {
  if (status === "CANCELLED") return null;
  if (status === "DRAFT") {
    return (
      <ConfirmActionButton
        label="Delete"
        confirmText={`Delete draft invoice ${invoiceNumber}? This cannot be undone.`}
        action={() => deleteInvoiceAction(id)}
      />
    );
  }
  return (
    <ConfirmActionButton
      label="Cancel"
      confirmText={`Cancel invoice ${invoiceNumber}? It will stay on record as CANCELLED and stop counting in the party ledger.`}
      action={() => cancelInvoiceAction(id)}
    />
  );
}
