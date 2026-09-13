"use client";

export default function PrintButton() {
  return (
    <div className="mx-auto mb-4 flex max-w-3xl justify-end print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
