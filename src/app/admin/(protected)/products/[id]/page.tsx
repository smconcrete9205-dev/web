import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductForm from "../ProductForm";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const action = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Edit Product</h1>
      <p className="mt-1 text-sm text-concrete-600">{product.name}</p>

      <div className="mt-6 max-w-3xl rounded-lg border border-concrete-200 bg-white p-6">
        <ProductForm product={product} action={action} />
      </div>
    </div>
  );
}
