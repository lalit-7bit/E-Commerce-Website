"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AccountLayout } from "@/components/account/account-layout";
import { ProtectedPage } from "@/components/account/protected-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById } from "@/lib/products";

interface WishlistProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
}

export default function AccountWishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    if (!user?.token) return;

    const loadWishlist = async () => {
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const wishlistProducts = (data.products || [])
          .map((productId: string) => getProductById(productId))
          .filter(Boolean)
          .map((product: NonNullable<ReturnType<typeof getProductById>>) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
          }));
        setProducts(wishlistProducts);
      }
    };

    loadWishlist();
  }, [user?.token]);

  const removeProduct = async (productId: string) => {
    if (!user?.token) return;

    const res = await fetch(`/api/wishlist/remove/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      setProducts((current) => current.filter((product) => product.id !== productId));
    }
  };

  return (
    <ProtectedPage>
      <AccountLayout
        title="Wishlist"
        description="Keep track of products you want to come back to later."
      >
        <Card>
          <CardHeader>
            <CardTitle>Saved Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Your wishlist is empty. Browse products and start saving favorites.
              </p>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <p className="mt-1 font-medium">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/products/${product.id}`}>View Product</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => removeProduct(product.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AccountLayout>
    </ProtectedPage>
  );
}
