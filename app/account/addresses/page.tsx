"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AccountLayout } from "@/components/account/account-layout";
import { ProtectedPage } from "@/components/account/protected-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressRecord {
  id: string;
  fullAddress: string;
  city: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const initialForm = {
  fullAddress: "",
  city: "",
  pincode: "",
  country: "India",
};

export default function AccountAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const loadAddresses = async () => {
      const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
      }
    };

    loadAddresses();
  }, [user?.token]);

  const createAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...form,
          isDefault: addresses.length === 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses((current) => [...current, data.address]);
        setForm(initialForm);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user?.token) return;

    const res = await fetch(`/api/addresses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) {
      setAddresses((current) => current.filter((address) => address.id !== id));
    }
  };

  return (
    <ProtectedPage>
      <AccountLayout
        title="Saved Addresses"
        description="Create and manage delivery addresses for faster checkout."
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createAddress} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullAddress">Full Address</Label>
                  <Input
                    id="fullAddress"
                    value={form.fullAddress}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, fullAddress: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, city: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, pincode: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, country: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Book</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.length === 0 && (
                <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
              )}
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {address.fullAddress}, {address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.pincode}, {address.country}
                    </p>
                    {address.isDefault && (
                      <p className="mt-1 text-xs uppercase tracking-wide text-primary">
                        Default address
                      </p>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => deleteAddress(address.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AccountLayout>
    </ProtectedPage>
  );
}
