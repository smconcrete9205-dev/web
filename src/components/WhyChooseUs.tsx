import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const REASONS = [
  {
    title: "IS-Code Compliant Manufacturing",
    description:
      "Every product is manufactured with reference to applicable IS code standards, with consistent quality control across batches.",
  },
  {
    title: "High-Strength Concrete Grades",
    description:
      "We use controlled concrete mix designs (M25–M40 grade, placeholder) to ensure durability under heavy structural and vehicular loads.",
  },
  {
    title: "Bulk Manufacturing Capacity",
    description:
      "Our factory setup supports large-volume orders for municipal contracts, infrastructure projects, and industrial supply.",
  },
  {
    title: "Pan-India Project Supply",
    description:
      "We supply and coordinate logistics for projects across states, with experience serving contractors and government tenders.",
  },
  {
    title: "Custom Sizes on Request",
    description:
      "Beyond standard dimensions, we manufacture products to project-specific drawings and load requirements.",
  },
  {
    title: "Dedicated Quote Turnaround",
    description:
      "Our sales team responds quickly to quote requests with pricing, lead time, and technical specification support.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Built for Contractors, Government Bodies, and Infrastructure Projects
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 0.08} className="flex flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy-900">
                <svg
                  className="h-5 w-5 text-accent-400"
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
              </div>
              <h3 className="mt-4 text-base font-semibold text-navy-900">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-concrete-700">
                {reason.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
