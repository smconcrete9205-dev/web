"use client";

import { useTransition } from "react";
import { deleteInvoiceAction } from "./actions";

export default function DeleteInvoiceButton({ id, invoiceNumber }: { id: string; invoiceNumber: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete invoice ${invoiceNumber}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteInvoiceAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
