"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  setProductBilling,
  DEFAULT_BILLING,
  type ProductBilling,
  type ProductInput,
  type ProductImage,
} from "@/lib/products";

export interface ProductFormState {
  error?: string;
}

function linesOf(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Parses "Label: Value" lines into {label, value} pairs. */
function parseSpecs(value: FormDataEntryValue | null) {
  return linesOf(value).map((line) => {
    const [label, ...rest] = line.split(":");
    return { label: label.trim(), value: rest.join(":").trim() };
  });
}

/** Parses the JSON array {src, alt}[] submitted by the ImageManager component. */
function parseImages(value: FormDataEntryValue | null): ProductImage[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is ProductImage => Boolean(item?.src))
      .map((item) => ({
        src: String(item.src).trim(),
        alt: String(item.alt ?? "").trim() || "Product image",
      }));
  } catch {
    return [];
  }
}

function parseFormData(formData: FormData): ProductInput {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: linesOf(formData.get("description")),
    features: linesOf(formData.get("features")),
    applications: linesOf(formData.get("applications")),
    specs: parseSpecs(formData.get("specs")),
    images: parseImages(formData.get("images")),
    seo: {
      title: String(formData.get("seoTitle") ?? "").trim(),
      description: String(formData.get("seoDescription") ?? "").trim(),
      keywords: linesOf(formData.get("seoKeywords")),
    },
  };
}

function parseBilling(formData: FormData): ProductBilling {
  const gst = parseFloat(String(formData.get("gstRate") ?? ""));
  const rate = parseFloat(String(formData.get("rate") ?? ""));
  return {
    hsnCode: String(formData.get("hsnCode") ?? "").trim() || DEFAULT_BILLING.hsnCode,
    unit: String(formData.get("unit") ?? "").trim() || DEFAULT_BILLING.unit,
    gstRate: Number.isFinite(gst) && gst >= 0 && gst <= 100 ? gst : DEFAULT_BILLING.gstRate,
    rate: Number.isFinite(rate) && rate >= 0 ? rate : 0,
  };
}

function validate(input: ProductInput): string | null {
  if (!input.slug) return "Slug is required.";
  if (!/^[a-z0-9-]+$/.test(input.slug)) {
    return "Slug can only contain lowercase letters, numbers, and hyphens.";
  }
  if (!input.name) return "Name is required.";
  if (!input.shortDescription) return "Short description is required.";
  if (input.images.length === 0) return "At least one image is required.";
  return null;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    const created = await createProduct(input);
    await setProductBilling(created.id, parseBilling(formData));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Unique constraint")) {
      return { error: "A product with this slug already exists." };
    }
    return { error: "Failed to create product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const input = parseFormData(formData);
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  try {
    await updateProduct(id, input);
    await setProductBilling(id, parseBilling(formData));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Unique constraint")) {
      return { error: "A product with this slug already exists." };
    }
    return { error: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${input.slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}
