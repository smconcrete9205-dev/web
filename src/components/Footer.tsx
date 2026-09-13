import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { getAllProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {
  const year = new Date().getFullYear();
  const [products, settings] = await Promise.all([getAllProducts(), getSiteSettings()]);

  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/images/logo.svg"
              alt={COMPANY.name}
              width={220}
              height={100}
              className="h-11 w-auto"
            />
            <p className="mt-4 text-sm leading-6 text-navy-300">
              Manufacturer of RCC precast concrete products for municipal,
              infrastructure, and industrial projects across India.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Products
            </h2>
            <ul className="mt-4 space-y-2">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm text-navy-300 hover:text-white"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-navy-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-navy-300 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-navy-300 hover:text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-navy-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-navy-300">
              <li>
                {settings.addressStreet}, {settings.addressLocality},{" "}
                {settings.addressRegion} {settings.addressPostalCode}
              </li>
              <li>
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-xs text-navy-400">
            &copy; {year} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-xs text-navy-500">
            Placeholder content — replace with final certifications and legal copy.
          </p>
        </div>
      </div>
    </footer>
  );
}
