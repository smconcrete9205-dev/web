"use client";

import { ConfirmActionButton } from "../FormUi";
import { deleteChallanAction } from "./actions";

export default function DeleteChallanButton({ id, number }: { id: string; number: string }) {
  return (
    <ConfirmActionButton
      label="Delete"
      confirmText={`Delete challan ${number}? This cannot be undone.`}
      action={() => deleteChallanAction(id)}
    />
  );
}
