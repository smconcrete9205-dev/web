"use client";

import { ConfirmActionButton } from "../FormUi";
import { deleteExpenseAction } from "./actions";

export default function DeleteExpenseButton({ id }: { id: string }) {
  return (
    <ConfirmActionButton
      label="Delete"
      confirmText="Delete this expense?"
      action={() => deleteExpenseAction(id)}
    />
  );
}
