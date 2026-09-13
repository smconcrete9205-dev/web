import { PrismaClient } from "@prisma/client";
import { seedProducts } from "./seed-data";
import { COMPANY } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: JSON.stringify(product.description),
        features: JSON.stringify(product.features),
        applications: JSON.stringify(product.applications),
        specs: JSON.stringify(product.specs),
        images: JSON.stringify(product.images),
        seoTitle: product.seo.title,
        seoDescription: product.seo.description,
        seoKeywords: JSON.stringify(product.seo.keywords),
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      phone: COMPANY.phone,
      phoneDisplay: COMPANY.phoneDisplay,
      whatsappNumber: COMPANY.whatsappNumber,
      email: COMPANY.email,
      addressStreet: COMPANY.address.streetAddress,
      addressLocality: COMPANY.address.addressLocality,
      addressRegion: COMPANY.address.addressRegion,
      addressPostalCode: COMPANY.address.postalCode,
      mapEmbedSrc: COMPANY.mapEmbedSrc,
      gstin: COMPANY.gstin,
    },
  });

  console.log(`Seeded ${seedProducts.length} products and site settings.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
