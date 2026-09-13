import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import ProductGrid from "@/components/ProductGrid";
import CTASection from "@/components/CTASection";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "RCC Precast Concrete Products",
  description: `Explore ${COMPANY.name}'s full range of RCC precast concrete products — manhole covers, spun pipes, slabs, route markers, interlocking tiles, and kerb stones.`,
  alternates: { canonical: "/products" },
};

// Products are admin-editable in the database — render fresh on every request.
export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Our RCC Precast Concrete Product Range"
        description="Manufactured to IS-code referenced specifications for municipal, infrastructure, and industrial projects. Select a product to view detailed specifications and request a quote."
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <ProductGrid />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
