import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | SM Concrete Products",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-concrete-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-concrete-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo-mark.svg"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <h1 className="mt-4 text-lg font-bold text-navy-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-concrete-500">SM Concrete Products</p>
        </div>

        <div className="mt-6">
          <LoginForm next={searchParams.next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
