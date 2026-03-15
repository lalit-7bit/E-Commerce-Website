"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images?.length ? product.images : [product.image];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[selectedIndex]}
          alt={product.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {product.discount && (
          <span className="absolute left-4 top-4 rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground">
            -{product.discount}% OFF
          </span>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/30"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
