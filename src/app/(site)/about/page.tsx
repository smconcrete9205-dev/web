import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import CTASection from "@/components/CTASection";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${COMPANY.name}'s manufacturing capability, quality process, and experience supplying RCC precast concrete products for infrastructure projects.`,
  alternates: { canonical: "/about" },
};

export const dynamic = "force-dynamic";

const CAPABILITIES = [
  {
    title: "Manufacturing Setup",
    description:
      "[Placeholder] Our facility operates precast concrete production lines including spinning, vibration, and curing capacity suited for large-volume orders. Replace with real plant capacity figures.",
  },
  {
    title: "Quality Control",
    description:
      "[Placeholder] Batch-wise testing of concrete cubes, dimensional checks, and reinforcement verification are carried out as part of our internal QC process. Replace with your actual QC procedure.",
  },
  {
    title: "Raw Material Sourcing",
    description:
      "[Placeholder] Cement, aggregates, and reinforcement steel are sourced from approved suppliers to maintain consistent mix design and strength. Replace with your sourcing details.",
  },
  {
    title: "Delivery & Logistics",
    description:
      "[Placeholder] We coordinate dispatch and delivery for bulk orders to project sites, including palletized and loose loading options. Replace with your logistics capability.",
  },
];

const CERTIFICATIONS = [
  "ISO Certification — Placeholder (add certificate number/scan)",
  "MSME / Udyam Registration — Placeholder",
  "GST Registration — Placeholder",
  "IS Code Testing Reports — Placeholder (link to lab reports)",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Manufacturing RCC Precast Concrete Products Since 2005"
        description="[Placeholder founding year and history — replace with your company's real background.] SM Concrete Products is a manufacturer of precast RCC concrete products serving municipal bodies, contractors, and infrastructure projects."
      />

      <section className="bg-white py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Our Story
            </h2>
            <p className="mt-4 text-base leading-7 text-concrete-700">
              [Placeholder] SM Concrete Products was established to supply
              reliable, IS-code compliant precast concrete products to
              municipal and infrastructure projects. Over the years, we have
              expanded our product range to cover manhole covers, spun pipes,
              slabs, route markers, interlocking tiles, and kerb stones.
            </p>
            <p className="mt-4 text-base leading-7 text-concrete-700">
              [Placeholder] Replace this section with your company&apos;s
              actual founding story, milestones, leadership background, and
              years of experience serving the construction and infrastructure
              sector.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src="/images/about.jpg"
              alt="Precast concrete manufacturing works (sample image)"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="bg-concrete-50 py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Manufacturing Capability
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="rounded-lg border border-concrete-200 bg-white p-6"
              >
                <h3 className="text-base font-semibold text-navy-900">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-concrete-700">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Certifications
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-concrete-700">
            [Placeholder — list your actual certifications below and attach
            certificate copies/scans when available.]
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CERTIFICATIONS.map((cert) => (
              <li
                key={cert}
                className="flex items-start gap-3 rounded-md border border-concrete-200 bg-concrete-50 p-4 text-sm text-concrete-700"
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-600"
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
                {cert}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
