import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Superadmin Login",
  robots: { index: false, follow: false },
};

export default function SuperLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-concrete-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-concrete-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-bold text-navy-900">Superadmin</h1>
        <p className="mt-1 text-sm text-concrete-500">Licence control</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
