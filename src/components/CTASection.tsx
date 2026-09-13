import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/settings";

export default async function CTASection() {
  const settings = await getSiteSettings();

  return (
    <section className="bg-navy-900">
      <Container className="flex flex-col items-center gap-6 py-14 text-center sm:py-16">
        <Reveal className="flex flex-col items-center gap-6">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Planning a Project? Get a Bulk Quote Today.
          </h2>
          <p className="max-w-xl text-base leading-7 text-navy-200">
            Share your requirement and our team will respond with pricing,
            lead time, and technical specifications for your order.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-accent-600 active:scale-[0.98]"
            >
              Request a Quote
            </Link>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center justify-center rounded-md border border-navy-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-navy-800 active:scale-[0.98]"
            >
              Call {settings.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
