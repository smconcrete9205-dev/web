/** Client-safe ERP option lists (no database imports, so forms can use them). */

export type PaymentMode = "CASH" | "UPI" | "BANK" | "CHEQUE" | "OTHER";

export const PAYMENT_MODES: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

export const EXPENSE_CATEGORIES = [
  "Raw Material",
  "Labour / Wages",
  "Transport",
  "Diesel / Fuel",
  "Electricity",
  "Machinery / Repairs",
  "Rent",
  "Office / Misc",
  "Other",
] as const;
