"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Truck } from "lucide-react";

export function CartSummary() {
  const { items, totalPrice } = useCart();

  const subtotal = totalPrice;
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const savings = items.reduce((acc, item) => {
    if (item.product.originalPrice) {
      return (
        acc +
        (item.product.originalPrice - item.product.price) * item.quantity
      );
    }
    return acc;
  }, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Order Summary
      </h2>

      {/* Promo code */}
      <div className="mb-4">
        <label
          htmlFor="promo-code"
          className="mb-1.5 block text-sm text-muted-foreground"
        >
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input id="promo-code" placeholder="Enter code" />
          <Button variant="outline">Apply</Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal.toLocaleString()}</span>
        </div>

        {savings > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-accent">You Save</span>
            <span className="text-accent">-${savings.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          {shipping === 0 ? (
            <span className="text-accent">Free</span>
          ) : (
            <span className="text-foreground">${shipping.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="text-foreground">${tax.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-foreground">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Free shipping message */}
      {shipping > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Add ${(50 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      {/* Checkout button */}
      <Button size="lg" className="mt-6 w-full">
        Proceed to Checkout
      </Button>

      {/* Trust badges */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4 text-primary" />
          <span>Free shipping on orders over $50</span>
        </div>
      </div>

      {/* Continue shopping */}
      <div className="mt-4 text-center">
        <Link
          href="/products"
          className="text-sm text-primary hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
