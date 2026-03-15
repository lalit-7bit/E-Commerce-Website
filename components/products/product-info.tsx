"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    setQuantity((q) => Math.min(q + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <p className="text-sm font-medium text-primary">{product.brand}</p>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating} ({product.reviewCount.toLocaleString()} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-foreground">
          ${product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
            <span className="rounded-md bg-destructive/10 px-2 py-1 text-sm font-semibold text-destructive">
              Save ${(product.originalPrice - product.price).toLocaleString()}
            </span>
          </>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="mb-2 font-semibold text-foreground">Description</h3>
        <p className="text-muted-foreground">{product.description}</p>
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {product.inStock ? (
          <>
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-sm font-medium text-accent">In Stock</span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-sm font-medium text-destructive">
              Out of Stock
            </span>
          </>
        )}
      </div>

      {/* Quantity selector and add to cart */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex items-center rounded-lg border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="rounded-r-none"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="w-16 border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= 10}
            className="rounded-l-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!product.inStock || inCart}
        >
          {inCart ? (
            <>
              <Check className="h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Truck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Free Shipping</p>
            <p className="text-xs text-muted-foreground">Orders over $50</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Warranty</p>
            <p className="text-xs text-muted-foreground">1 year included</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <RotateCcw className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Easy Returns</p>
            <p className="text-xs text-muted-foreground">30-day policy</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Specifications */}
      <div>
        <h3 className="mb-4 font-semibold text-foreground">Specifications</h3>
        <dl className="space-y-2">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2"
            >
              <dt className="text-sm text-muted-foreground">{key}</dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
