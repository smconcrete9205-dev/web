import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
        404 Error
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-900">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-base leading-7 text-concrete-700">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
      >
        Back to Home
      </Link>
    </Container>
  );
}
