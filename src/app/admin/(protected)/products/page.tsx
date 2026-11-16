import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Products</h1>
          <p className="mt-1 text-sm text-concrete-600">
            {products.length} product{products.length === 1 ? "" : "s"} live on the site.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6 space-y-3 lg:hidden">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border border-concrete-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-navy-900">{product.name}</p>
            <p className="mt-1 break-all text-sm text-concrete-500">/products/{product.slug}</p>
            <p className="text-sm text-concrete-500">{product.images.length} image{product.images.length === 1 ? "" : "s"}</p>
            <div className="mt-3 flex items-center gap-5 border-t border-concrete-100 pt-3">
              <Link href={`/products/${product.slug}`} target="_blank" className="text-sm font-medium text-navy-700">View</Link>
              <Link href={`/admin/products/${product.id}`} className="text-sm font-medium text-accent-600">Edit</Link>
              <DeleteProductButton id={product.id} name={product.name} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-concrete-200 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-concrete-50 text-xs uppercase tracking-wide text-concrete-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{product.name}</td>
                <td className="px-4 py-3 text-concrete-500">/products/{product.slug}</td>
                <td className="px-4 py-3 text-concrete-500">{product.images.length}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="text-sm font-medium text-navy-700 hover:text-navy-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-medium text-accent-600 hover:text-accent-700"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
