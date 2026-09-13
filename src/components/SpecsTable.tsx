import type { ProductSpec } from "@/lib/products";

export default function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-concrete-200">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Product specifications</caption>
        <tbody className="divide-y divide-concrete-200">
          {specs.map((spec) => (
            <tr key={spec.label} className="odd:bg-concrete-50">
              <th
                scope="row"
                className="w-1/3 px-4 py-3 font-semibold text-navy-900"
              >
                {spec.label}
              </th>
              <td className="px-4 py-3 text-concrete-700">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
