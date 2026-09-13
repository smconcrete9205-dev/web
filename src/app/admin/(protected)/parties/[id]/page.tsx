import { notFound } from "next/navigation";
import { getPartyById } from "@/lib/parties";
import PartyForm from "../PartyForm";
import { updatePartyAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPartyPage({ params }: { params: { id: string } }) {
  const party = await getPartyById(params.id);
  if (!party) notFound();

  const action = updatePartyAction.bind(null, party.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Edit Party</h1>
      <p className="mt-1 text-sm text-concrete-600">{party.name}</p>

      <div className="mt-6 max-w-3xl rounded-lg border border-concrete-200 bg-white p-6">
        <PartyForm party={party} action={action} />
      </div>
    </div>
  );
}
