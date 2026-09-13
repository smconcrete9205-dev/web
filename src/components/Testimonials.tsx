import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const TESTIMONIALS = [
  {
    quote:
      "Placeholder testimonial — replace with a real quote from a contractor or municipal client describing product quality and delivery timelines.",
    author: "Client Name",
    role: "Project Manager, Placeholder Infra Pvt. Ltd.",
  },
  {
    quote:
      "Placeholder testimonial — replace with a real quote highlighting bulk order reliability and IS-code compliance.",
    author: "Client Name",
    role: "Procurement Head, Placeholder Constructions",
  },
  {
    quote:
      "Placeholder testimonial — replace with a real quote about customer support and on-time site delivery.",
    author: "Client Name",
    role: "Site Engineer, Placeholder Municipal Corporation",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-concrete-50 py-16 sm:py-20">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
            Client Feedback
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Trusted by Contractors and Project Teams
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              className="flex flex-col justify-between rounded-lg border border-concrete-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <figure className="flex flex-1 flex-col justify-between">
                <blockquote className="text-sm leading-6 text-concrete-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-concrete-100 pt-4">
                  <p className="text-sm font-semibold text-navy-900">{t.author}</p>
                  <p className="text-xs text-concrete-500">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
