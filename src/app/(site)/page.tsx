import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Container from "@/components/Container";
import ProductGrid from "@/components/ProductGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { localBusinessSchema } from "@/lib/schema";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "RCC Precast Concrete Products Manufacturer",
  description: `${COMPANY.name} manufactures RCC manhole covers, spun pipes, slabs, route markers, interlocking tiles, and kerb stones for infrastructure and municipal projects. Request a bulk quote.`,
  alternates: { canonical: "/" },
};

// Product catalog and contact settings are admin-editable in the database —
// render fresh on every request so changes in /admin show up immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const schema = await localBusinessSchema();

  return (
    <>
      <JsonLd data={schema} />
      <Hero />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
                Our Products
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                Precast RCC Products for Every Infrastructure Need
              </h2>
              <p className="mt-3 text-base leading-7 text-concrete-700">
                From drainage access covers to road paving and pipeline
                markers — manufactured to consistent quality standards.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden shrink-0 rounded-md border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-50 sm:inline-flex"
            >
              View All Products
            </Link>
          </div>

          <div className="mt-10">
            <ProductGrid />
          </div>

          <div className="mt-8 sm:hidden">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center rounded-md border border-navy-200 px-5 py-3 text-sm font-semibold text-navy-900 hover:bg-navy-50"
            >
              View All Products
            </Link>
          </div>
        </Container>
      </section>

      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
}
