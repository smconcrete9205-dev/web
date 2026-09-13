"use client";

import { useRef, useState } from "react";
import type { ProductImage } from "@/lib/products";

interface ImageManagerProps {
  initialImages: ProductImage[];
}

/**
 * Uploads image files straight from the admin panel (POST /api/admin/upload)
 * instead of requiring the admin to manually copy files into public/images
 * and type out paths. The resulting {src, alt}[] array is serialized into a
 * hidden "images" input so it submits with the rest of the product form.
 */
export default function ImageManager({ initialImages }: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setImages((prev) => [...prev, { src: data.path, alt: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="overflow-hidden rounded-md border border-concrete-200"
            >
              {/* Admin-only preview of an uploaded/typed path — plain img avoids
                  next/image's remote-pattern and static-import constraints here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="h-28 w-full object-cover" />
              <div className="space-y-1 p-2">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Alt text"
                  className="block w-full rounded border border-concrete-300 px-2 py-1 text-xs focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-concrete-300 bg-white px-4 py-2 text-sm font-medium text-navy-900 hover:bg-concrete-50">
          {uploading ? "Uploading..." : "+ Upload Image"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-1 text-xs text-concrete-500">JPG, PNG, or WEBP, up to 5MB.</p>
        {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
}
