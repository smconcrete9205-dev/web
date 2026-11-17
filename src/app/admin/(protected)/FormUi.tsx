"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-900">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

/** Button that runs a server action after a confirm() prompt and alerts on an error result. */
export function ConfirmActionButton({
  label,
  confirmText,
  action,
  className = "text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50",
}: {
  label: string;
  confirmText: string;
  action: () => Promise<{ error?: string } | void>;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(async () => {
          const result = await action();
          if (result && result.error) alert(result.error);
        });
      }}
    >
      {label}
    </button>
  );
}
