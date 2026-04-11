"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AccountLayout } from "@/components/account/account-layout";
import { ProtectedPage } from "@/components/account/protected-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiUrl } from "@/lib/api";

interface OrderRecord {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number }>;
  address: {
    fullAddress: string;
    city: string;
    pincode: string;
    country: string;
  };
}

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const loadOrders = async () => {
      try {
        const res = await fetch(getApiUrl("/api/orders"), {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user?.token]);

  return (
    <ProtectedPage>
      <AccountLayout
        title="Order History"
        description="Review past purchases, totals, and shipping addresses."
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && <p className="text-sm text-muted-foreground">Loading orders...</p>}
            {!isLoading && orders.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No orders yet. Complete checkout from your cart to place your first order.
              </p>
            )}
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">
                      {order.status}
                    </Badge>
                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </div>
                <div className="mt-2 text-sm">
                  Delivering to {order.address.fullAddress}, {order.address.city},{" "}
                  {order.address.pincode}, {order.address.country}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AccountLayout>
    </ProtectedPage>
  );
}
