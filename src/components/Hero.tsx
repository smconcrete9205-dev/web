import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { COMPANY } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Container className="relative grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <Reveal immediate>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            {COMPANY.tagline}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Precast RCC Concrete Products, Engineered for Strength.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-navy-200">
            SM Concrete Products manufactures manhole covers, spun pipes,
            slabs, route markers, interlocking tiles, and kerb stones for
            municipal, infrastructure, and industrial projects — built to
            IS-code standards and delivered at scale.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-accent-600 active:scale-[0.98]"
            >
              Request a Bulk Quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-navy-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-navy-800 active:scale-[0.98]"
            >
              Browse Products
            </Link>
          </div>
        </Reveal>

        <Reveal
          immediate
          delay={0.15}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-navy-700"
        >
          <Image
            src="/images/hero.jpg"
            alt="Precast concrete manufacturing yard (sample image)"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </Container>
    </section>
  );
}
