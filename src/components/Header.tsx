import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import MobileNav from "@/components/MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  phone: string;
  phoneDisplay: string;
}

export default function Header({ phone, phoneDisplay }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-800 bg-navy-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label={`${COMPANY.name} — Home`}>
          <Image
            src="/images/logo.svg"
            alt={COMPANY.name}
            width={220}
            height={100}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-navy-100 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${phone}`}
            className="text-sm font-semibold text-navy-100 hover:text-white"
          >
            {phoneDisplay}
          </a>
          <Link
            href="/contact"
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Request a Quote
          </Link>
        </div>

        <MobileNav links={NAV_LINKS} phone={phone} phoneDisplay={phoneDisplay} />
      </div>
    </header>
  );
}
