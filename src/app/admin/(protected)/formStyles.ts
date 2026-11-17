export const inputClass =
  "block w-full rounded-md border border-concrete-300 px-3 py-2 text-sm shadow-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

export const primaryBtn =
  "rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600";

export const outlineBtn =
  "rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50";

export function toDateInputValue(date: Date | null | undefined): string {
  const d = date ? new Date(date) : new Date();
  // Use local calendar date so "today" doesn't flip to yesterday/tomorrow around midnight.
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
