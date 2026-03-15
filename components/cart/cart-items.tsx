"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, Math.min(newQuantity, 10));
    }
  };

  return (
    <div className="flex gap-4 border-b border-border py-6">
      {/* Product image */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </Link>

      {/* Product details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <h3 className="font-semibold text-foreground hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Quantity and remove controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="h-8 w-12 border-0 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-foreground sm:text-lg">
              ${(product.price * quantity).toLocaleString()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartItems() {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Cart Items ({items.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-muted-foreground hover:text-destructive"
        >
          Clear Cart
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="divide-y divide-border px-4">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
