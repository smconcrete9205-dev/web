import { cache } from "react";
import type { Product as ProductRow } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Product data access layer — backed by the database (see prisma/schema.prisma)
 * and managed through the admin panel at /admin/products.
 *
 * Every page that needs product data (home, /products, /products/[slug], the
 * footer, the QuoteRequestForm dropdown) calls into this file. No page ever
 * touches Prisma directly, so the storage layer can change without touching
 * page code.
 */

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string[];
  specs: ProductSpec[];
  features: string[];
  applications: string[];
  images: ProductImage[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/** Shape submitted by the admin product form — same as Product minus `id`. */
export type ProductInput = Omit<Product, "id">;

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: parseJson<string[]>(row.description, []),
    features: parseJson<string[]>(row.features, []),
    applications: parseJson<string[]>(row.applications, []),
    specs: parseJson<ProductSpec[]>(row.specs, []),
    images: parseJson<ProductImage[]>(row.images, []),
    seo: {
      title: row.seoTitle,
      description: row.seoDescription,
      keywords: parseJson<string[]>(row.seoKeywords, []),
    },
  };
}

function toRowData(input: ProductInput) {
  return {
    slug: input.slug,
    name: input.name,
    shortDescription: input.shortDescription,
    description: JSON.stringify(input.description),
    features: JSON.stringify(input.features),
    applications: JSON.stringify(input.applications),
    specs: JSON.stringify(input.specs),
    images: JSON.stringify(input.images),
    seoTitle: input.seo.title,
    seoDescription: input.seo.description,
    seoKeywords: JSON.stringify(input.seo.keywords),
  };
}

export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(toProduct);
  } catch (err) {
    // Falls back to an empty catalog rather than throwing, so a DB outage or
    // misconfiguration (e.g. a missing DATABASE_URL) doesn't crash the build
    // or take down the whole site — see getSiteSettings() for the same pattern.
    console.error("getAllProducts: falling back to an empty list —", err);
    return [];
  }
});

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : null;
});

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const row = await prisma.product.create({ data: toRowData(input) });
  return toProduct(row);
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product> {
  const row = await prisma.product.update({
    where: { id },
    data: toRowData(input),
  });
  return toProduct(row);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

/**
 * Billing defaults per product — used to auto-fill invoice and challan lines.
 * Kept separate from `Product` so pricing never travels with public-site data.
 */
export interface ProductBilling {
  hsnCode: string;
  unit: string;
  gstRate: number;
  /** Default rate per unit in rupees (0 = not set). */
  rate: number;
}

export const DEFAULT_BILLING: ProductBilling = { hsnCode: "6810", unit: "Nos", gstRate: 18, rate: 0 };

export async function getProductBilling(id: string): Promise<ProductBilling> {
  const row = await prisma.product.findUnique({
    where: { id },
    select: { hsnCode: true, unit: true, gstRate: true, ratePaise: true },
  });
  if (!row) return DEFAULT_BILLING;
  return { hsnCode: row.hsnCode, unit: row.unit, gstRate: row.gstRate, rate: row.ratePaise / 100 };
}

export async function setProductBilling(id: string, billing: ProductBilling): Promise<void> {
  await prisma.product.update({
    where: { id },
    data: {
      hsnCode: billing.hsnCode,
      unit: billing.unit,
      gstRate: billing.gstRate,
      ratePaise: Math.round(billing.rate * 100),
    },
  });
}
