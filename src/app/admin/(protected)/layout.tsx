import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/admin/login/actions";
import AdminMobileNav from "./AdminMobileNav";
import LicenseBanner from "./LicenseBanner";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/analytics", label: "Website Traffic" },
  { href: "/admin/parties", label: "Parties" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/challans", label: "Challans" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-concrete-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-concrete-200 bg-navy-900 md:flex">
        <div className="flex items-center gap-2 border-b border-navy-800 px-5 py-5">
          <Image
            src="/images/logo-mark.svg"
            unoptimized
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </div>
        <nav aria-label="Admin" className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-navy-100 hover:bg-navy-800 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-navy-800 p-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white"
          >
            ← Back to site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <AdminMobileNav links={NAV_LINKS} logoutAction={logout} />

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <LicenseBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
