import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";
import { COMPANY } from "@/lib/constants";
import { getAllProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${COMPANY.name} for bulk quotes, product specifications, and project enquiries. Call, WhatsApp, or send us your requirement.`,
  alternates: { canonical: "/contact" },
};

// Contact details and the product dropdown are admin-editable — render fresh.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [schema, products, settings] = await Promise.all([
    localBusinessSchema(),
    getAllProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd data={schema} />

      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        description="Have a project requirement or bulk order enquiry? Reach out via phone, WhatsApp, or the form below."
      />

      <section className="bg-white py-12 sm:py-16">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Send an Enquiry
            </h2>
            <div className="mt-6 rounded-lg border border-concrete-200 bg-concrete-50 p-6">
              <QuoteRequestForm products={products} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">
              Contact Details
            </h2>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-navy-900">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${settings.phone}`} className="text-concrete-700 hover:text-navy-700">
                    {settings.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${settings.email}`} className="text-concrete-700 hover:text-navy-700">
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Address</dt>
                <dd className="mt-1 text-concrete-700">
                  {settings.addressStreet}
                  <br />
                  {settings.addressLocality}, {settings.addressRegion}{" "}
                  {settings.addressPostalCode}
                  <br />
                  India
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Business Hours</dt>
                <dd className="mt-1 space-y-1 text-concrete-700">
                  {COMPANY.businessHours.map((entry) => (
                    <div key={entry.day} className="flex justify-between gap-4">
                      <span>{entry.day}</span>
                      <span>{entry.hours}</span>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <WhatsAppButton
                phoneNumber={settings.whatsappNumber}
                message="Hi, I'd like to enquire about your RCC concrete products."
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-concrete-200">
              <iframe
                title={`${COMPANY.name} location map`}
                src={settings.mapEmbedSrc}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-xs text-concrete-500">
              Map placeholder — update the Google Maps embed link from{" "}
              /admin/settings.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
