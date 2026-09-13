import Container from "@/components/Container";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-navy-800 bg-navy-900 py-14 sm:py-16">
      <Container>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-navy-200">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
