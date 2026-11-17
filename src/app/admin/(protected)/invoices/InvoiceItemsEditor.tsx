"use client";

import { useState } from "react";
import type { InvoiceItem } from "@/lib/invoices";
import { formatINR } from "@/lib/money";
import type { ItemSuggestion } from "@/lib/itemSuggestions";

const EMPTY_ITEM: InvoiceItem = {
  description: "",
  hsnCode: "",
  quantity: 1,
  unit: "Nos",
  rate: 0,
  gstRate: 18,
};

const inputClass =
  "block w-full rounded border border-concrete-300 px-2 py-1.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500";

export default function InvoiceItemsEditor({
  initialItems,
  onTotalsChange,
  suggestions = [],
}: {
  initialItems: InvoiceItem[];
  /** Catalog products to pick from; picking one fills HSN / unit / rate / GST. */
  suggestions?: ItemSuggestion[];
  /** Called with the current line-item subtotal (rupees, pre-GST) whenever items change — used to show a live preview. */
  onTotalsChange?: (subtotal: number, gst: number) => void;
}) {
  const [items, setItems] = useState<InvoiceItem[]>(
    initialItems.length > 0 ? initialItems : [EMPTY_ITEM]
  );

  function update(index: number, patch: Partial<InvoiceItem>) {
    setItems((prev) => {
      const next = prev.map((item, i) => (i === index ? { ...item, ...patch } : item));
      notify(next);
      return next;
    });
  }

  function notify(next: InvoiceItem[]) {
    if (!onTotalsChange) return;
    let subtotal = 0;
    let gst = 0;
    for (const item of next) {
      const lineSubtotal = item.quantity * item.rate;
      subtotal += lineSubtotal;
      gst += lineSubtotal * (item.gstRate / 100);
    }
    onTotalsChange(subtotal, gst);
  }

  /** Typing or picking a name that matches a known product auto-fills its defaults. */
  function onDescriptionChange(index: number, value: string) {
    const match = suggestions.find((s) => s.name.toLowerCase() === value.trim().toLowerCase());
    if (match) {
      update(index, {
        description: match.name,
        hsnCode: match.hsnCode,
        unit: match.unit,
        rate: match.rate,
        gstRate: match.gstRate,
      });
    } else {
      update(index, { description: value });
    }
  }

  function addRow() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeRow(index: number) {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      notify(next);
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <datalist id="invoice-products">
        {suggestions.map((s) => (
          <option key={s.name} value={s.name} />
        ))}
      </datalist>

      <div className="overflow-x-auto rounded-lg border border-concrete-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">HSN</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit</th>
              <th className="px-3 py-2">Rate (₹)</th>
              <th className="px-3 py-2">GST %</th>
              <th className="px-3 py-2 text-right">Line Total</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200 bg-white">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="px-3 py-2">
                  <input
                    value={item.description}
                    list="invoice-products"
                    onChange={(e) => onDescriptionChange(i, e.target.value)}
                    placeholder="Pick a product or type..."
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={item.hsnCode}
                    onChange={(e) => update(i, { hsnCode: e.target.value })}
                    placeholder="6810"
                    className={`${inputClass} w-24 font-mono`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => update(i, { quantity: parseFloat(e.target.value) || 0 })}
                    className={`${inputClass} w-20`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={item.unit}
                    onChange={(e) => update(i, { unit: e.target.value })}
                    className={`${inputClass} w-20`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.rate}
                    onChange={(e) => update(i, { rate: parseFloat(e.target.value) || 0 })}
                    className={`${inputClass} w-28`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={item.gstRate}
                    onChange={(e) => update(i, { gstRate: parseFloat(e.target.value) || 0 })}
                    className={`${inputClass} w-20`}
                  />
                </td>
                <td className="px-3 py-2 text-right text-concrete-700">
                  {formatINR(Math.round(item.quantity * item.rate * 100))}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={items.length === 1}
                    className="text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 rounded-md border border-concrete-300 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50"
      >
        + Add Line
      </button>
    </div>
  );
}
