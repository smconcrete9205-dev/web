import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources & Guides",
  description: `IS code references, installation guides, and technical resources for RCC precast concrete products from ${COMPANY.name}.`,
  alternates: { canonical: "/blog" },
};

const PLANNED_TOPICS = [
  "IS Code Guide: RCC Manhole Cover Load Classes Explained",
  "How to Install RCC Spun Pipes for Drainage Projects",
  "Choosing the Right Kerb Stone Profile for Your Road Project",
  "Interlocking Tiles vs. Cast-in-Situ Paving: A Comparison",
  "Understanding IS 458 for RCC Spun Pipes",
];

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Guides, IS Codes & Installation Resources"
        description="This section is reserved for future SEO content — installation guides, IS code references, and technical articles about our RCC precast concrete products."
      />

      <section className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-base leading-7 text-concrete-700">
            No articles have been published yet. This page is structured and
            ready for future content — add posts under{" "}
            <code className="rounded bg-concrete-100 px-1.5 py-0.5 text-sm">
              src/app/blog/[slug]/page.tsx
            </code>{" "}
            following the same pattern used for product pages (a content
            config file plus a dynamic route) once you&apos;re ready to
            publish.
          </p>

          <h2 className="mt-10 text-lg font-semibold text-navy-900">
            Planned Topics
          </h2>
          <ul className="mt-4 space-y-3">
            {PLANNED_TOPICS.map((topic) => (
              <li
                key={topic}
                className="rounded-md border border-concrete-200 bg-concrete-50 px-4 py-3 text-sm text-concrete-700"
              >
                {topic}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
