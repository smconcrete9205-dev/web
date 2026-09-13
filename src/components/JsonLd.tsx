/**
 * Renders a JSON-LD <script> tag for structured data (Organization, Product, LocalBusiness, etc).
 * Pass any schema.org-shaped object; it will be safely serialized.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
