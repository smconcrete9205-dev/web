"use client";

import { ConfirmActionButton } from "../FormUi";
import { deletePartyAction } from "./actions";

export default function DeletePartyButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmActionButton
      label="Delete"
      confirmText={`Delete "${name}"? This cannot be undone.`}
      action={() => deletePartyAction(id)}
    />
  );
}
