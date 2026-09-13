import PartyForm from "../PartyForm";
import { createPartyAction } from "../actions";

export default function NewPartyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Add Party</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Add a customer or vendor to use on invoices, purchase orders, and payments.
      </p>

      <div className="mt-6 max-w-3xl rounded-lg border border-concrete-200 bg-white p-6">
        <PartyForm action={createPartyAction} />
      </div>
    </div>
  );
}
