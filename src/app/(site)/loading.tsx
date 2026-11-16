export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
