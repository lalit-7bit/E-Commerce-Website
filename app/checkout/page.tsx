"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiUrl } from "@/lib/api";

interface AddressOption {
  id: string;
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const emptyAddress = {
  fullAddress: "",
  city: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const loadAddresses = async () => {
      const res = await fetch(getApiUrl("/api/addresses"), {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) return;
      const loadedAddresses = data.addresses || [];
      setAddresses(loadedAddresses);
      const defaultAddress =
        loadedAddresses.find((entry: AddressOption) => entry.isDefault) ||
        loadedAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setAddress({
          fullAddress: defaultAddress.fullAddress,
          city: defaultAddress.city,
          pincode: defaultAddress.pincode,
          country: defaultAddress.country,
        });
      }
    };

    loadAddresses();
  }, [user?.token]);

  useEffect(() => {
    if (!selectedAddressId) return;
    const selected = addresses.find((entry) => entry.id === selectedAddressId);
    if (selected) {
      setAddress({
        fullAddress: selected.fullAddress,
        city: selected.city,
        pincode: selected.pincode,
        country: selected.country,
      });
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router, user]);

  if (!user || items.length === 0) {
    return null;
  }

  const handleCheckout = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (saveAddress && !selectedAddressId) {
        const saveRes = await fetch(getApiUrl("/api/addresses"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...address,
            isDefault: addresses.length === 0,
          }),
        });

        if (saveRes.ok) {
          const saveData = await saveRes.json();
          setAddresses((current) => [...current, saveData.address]);
        }
      }

      const res = await fetch(getApiUrl("/api/orders/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      clearCart();
      setSuccess("Order placed successfully.");
      setTimeout(() => router.push("/account/orders"), 1200);
    } catch {
      setError("Unable to place the order right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Review your delivery details and place the order.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="saved-address">Saved Addresses</Label>
                  <select
                    id="saved-address"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    <option value="">Enter a new address</option>
                    {addresses.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.fullAddress}, {entry.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="full-address">Full Address</Label>
                <Input
                  id="full-address"
                  value={address.fullAddress}
                  onChange={(e) =>
                    setAddress((current) => ({ ...current, fullAddress: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((current) => ({ ...current, city: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress((current) => ({ ...current, pincode: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress((current) => ({ ...current, country: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {!selectedAddressId && (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  Save this address to my account
                </label>
              )}

              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-lg font-semibold">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
