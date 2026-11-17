"use client";

import { ConfirmActionButton } from "../FormUi";
import { deletePaymentAction } from "./actions";

export default function DeletePaymentButton({ id }: { id: string }) {
  return (
    <ConfirmActionButton
      label="Delete"
      confirmText="Delete this payment? The invoice balance will be recalculated."
      action={() => deletePaymentAction(id)}
    />
  );
}
