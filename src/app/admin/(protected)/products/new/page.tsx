import ProductForm from "../ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900">Add Product</h1>
      <p className="mt-1 text-sm text-concrete-600">
        Appears immediately on the live site once created.
      </p>

      <div className="mt-6 max-w-3xl rounded-lg border border-concrete-200 bg-white p-6">
        <ProductForm action={createProductAction} />
      </div>
    </div>
  );
}
