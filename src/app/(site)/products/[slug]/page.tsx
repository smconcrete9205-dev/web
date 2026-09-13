import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import ProductGallery from "@/components/ProductGallery";
import SpecsTable from "@/components/SpecsTable";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import { productSchema, breadcrumbSchema } from "@/lib/schema";

interface ProductPageProps {
  params: { slug: string };
}

// Products are admin-editable in the database — render fresh on every request
// so a new/edited product shows up immediately without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: product.images[0] ? [{ url: product.images[0].src }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [products, settings] = await Promise.all([getAllProducts(), getSiteSettings()]);

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: product.name, url: `/products/${product.slug}` },
        ])}
      />

      <PageHeader eyebrow="Product" title={product.name} />

      <nav aria-label="Breadcrumb" className="border-b border-concrete-200 bg-concrete-50">
        <Container className="py-3 text-sm text-concrete-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-navy-700">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-navy-700">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-navy-900" aria-current="page">
              {product.name}
            </li>
          </ol>
        </Container>
      </nav>

      <section className="bg-white py-12 sm:py-16">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <ProductGallery images={product.images} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Overview
            </h2>
            {product.description.map((paragraph, i) => (
              <p key={i} className="mt-4 text-base leading-7 text-concrete-700">
                {paragraph}
              </p>
            ))}

            <h3 className="mt-8 text-lg font-semibold text-navy-900">
              Key Features
            </h3>
            <ul className="mt-3 space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-concrete-700">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-navy-900">
              Typical Applications
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.applications.map((app) => (
                <li
                  key={app}
                  className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800"
                >
                  {app}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <WhatsAppButton
                phoneNumber={settings.whatsappNumber}
                message={`Hi, I'd like to enquire about ${product.name}.`}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-concrete-50 py-12 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">
            Specifications
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-concrete-600">
            Placeholder specification values shown below — replace with your
            verified dimensions, load ratings, and IS code references.
          </p>
          <div className="mt-6 max-w-3xl">
            <SpecsTable specs={product.specs} />
          </div>
        </Container>
      </section>

      <section id="quote" className="bg-white py-12 sm:py-16">
        <Container className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-navy-900">
            Request a Quote for {product.name}
          </h2>
          <p className="mt-2 text-sm text-concrete-600">
            Fill out the form below and our team will get back to you with
            pricing and lead time.
          </p>
          <div className="mt-6 rounded-lg border border-concrete-200 bg-concrete-50 p-6">
            <QuoteRequestForm products={products} defaultProduct={product.name} />
          </div>
        </Container>
      </section>
    </>
  );
}
