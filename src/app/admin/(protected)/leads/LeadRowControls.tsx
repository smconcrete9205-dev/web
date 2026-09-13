"use client";

import { useState, useTransition } from "react";
import { setLeadStatus, removeLead } from "./actions";
import type { LeadStatus } from "@/lib/leads";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "closed"];

export default function LeadRowControls({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: LeadStatus) {
    setCurrent(next);
    startTransition(async () => {
      await setLeadStatus(id, next);
    });
  }

  function handleDelete() {
    if (!confirm("Delete this lead permanently?")) return;
    startTransition(async () => {
      await removeLead(id);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
        className="rounded-md border border-concrete-300 bg-white px-2 py-1 text-xs capitalize focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
