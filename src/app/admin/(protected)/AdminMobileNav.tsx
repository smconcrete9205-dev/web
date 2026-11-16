"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  links: { href: string; label: string }[];
  logoutAction: () => void | Promise<void>;
}

export default function AdminMobileNav({ links, logoutAction }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-navy-800 bg-navy-900 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-navy-800"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-sm font-bold text-white">Admin Panel</span>
        <span className="w-9" aria-hidden="true" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 max-w-[80%] flex-col bg-navy-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-800 px-5 py-4">
              <span className="text-sm font-bold text-white">Admin Panel</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-navy-800"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav aria-label="Admin mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {links.map((link) => {
                  const active =
                    link.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                          active
                            ? "bg-navy-800 text-white"
                            : "text-navy-100 hover:bg-navy-800 hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-navy-800 p-3">
              <Link
                href="/"
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white"
              >
                ← Back to site
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white"
                >
                  Log out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
