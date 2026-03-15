"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.discount && (
            <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
              -{product.discount}%
            </span>
          )}
          {product.bestDeal && (
            <span className="absolute right-2 top-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
              Best Deal
            </span>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <p className="mb-1 text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] font-semibold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <Button
          variant={inCart ? "secondary" : "default"}
          size="sm"
          className="w-full gap-2"
          onClick={() => !inCart && addToCart(product)}
          disabled={!product.inStock}
        >
          {!product.inStock ? (
            "Out of Stock"
          ) : inCart ? (
            <>
              <Check className="h-4 w-4" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
