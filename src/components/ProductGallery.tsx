import Image from "next/image";
import type { ProductImage } from "@/lib/products";

/**
 * Server-rendered image gallery — no client JS. Shows the primary image large,
 * with remaining images as a thumbnail strip below. Swap the placeholder SVGs
 * in /public/images/products for real photography when available.
 */
export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [primary, ...rest] = images;
  if (!primary) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-concrete-200 bg-navy-900">
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {rest.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-concrete-200 bg-navy-900"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
