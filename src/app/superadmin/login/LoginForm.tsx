"use client";

import { useFormState, useFormStatus } from "react-dom";
import { superLogin, type SuperLoginState } from "./actions";

const field =
  "mt-1 block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function SuperLoginForm() {
  const [state, formAction] = useFormState<SuperLoginState, FormData>(superLogin, {});
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-navy-900">
          Username
        </label>
        <input id="username" name="username" type="text" required autoComplete="username" className={field} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-navy-900">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
